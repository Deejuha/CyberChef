/**
 * @author Michal Juszczyk [michaljuszczyk2@gmail.com]
 */

import forge from "node-forge";
import Operation from "../Operation.mjs";
import OperationError from "../errors/OperationError.mjs";
import Utils from "../Utils.mjs";

const blockSize = 16;

/**
 * CmacAes operation
 */
class CmacAes extends Operation {
    /**
     * CmacAes constructor
     */
    constructor() {
        super();

        this.name = "CMAC AES";
        this.module = "Default";
        this.description = "Cipher-based Message Authentication Code algorithm. This algorithm is based on AES-128 and designed to detect intentional, unauthorized modifications of the data, as well as accidental modifications.";
        this.infoURL = "https://datatracker.ietf.org/doc/html/rfc4493";
        this.inputType = "string";
        this.outputType = "string";
        this.args = [
            {
                "name": "Key",
                "type": "toggleString",
                "value": "",
                "toggleValues": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Input",
                "type": "option",
                "value": ["Hex", "UTF8", "Latin1", "Base64"]
            },
            {
                "name": "Output",
                "type": "option",
                "value": ["Hex"]
            },
        ];
    }
    /**
     * @param {string} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        const key = Utils.convertToByteString(args[0].string, args[0].option);
        if ([16, 24, 32].indexOf(key.length) < 0) {
            throw new OperationError(`Invalid key length: ${key.length} bytes.
Shall be 16, 24 or 32 bytes.`);
        }
        const inputType = args[1];
        const cmacInput = Utils.convertToByteArray(input, inputType);
        // Ported from https://github.com/allan-stewart/node-aes-cmac/pull/2
        const { subkey1, subkey2 } = generateSubkeys(key);

        let blockCount = Math.ceil(cmacInput.length / blockSize);
        let lastBlockCompleteFlag;
        let lastBlock;

        if (blockCount === 0) {
            blockCount = 1;
            lastBlockCompleteFlag = false;
        } else {
            lastBlockCompleteFlag = (cmacInput.length % blockSize === 0);
        }

        const lastBlockIndex = blockCount - 1;

        if (lastBlockCompleteFlag) {
            lastBlock = xor(getMessageBlock(cmacInput, lastBlockIndex), subkey1);
        } else {
            lastBlock = xor(getMessageBlock(cmacInput, lastBlockIndex), subkey2, true);
        }

        let x = Buffer.from('00000000000000000000000000000000', 'hex');
        let y;

        for (let index = 0; index < lastBlockIndex; index++) {
            y = xor(x, getMessageBlock(cmacInput, index));
            x = aes(key, y);
        }

        y = xor(lastBlock, x);

        return aes(key, y);
    }
}

function generateSubkeys(key) {
    const cryptedKey = aes(key, Utils.convertToByteString("00000000000000000000000000000000", "Hex"));

    let subkey1 = bitShiftLeft(cryptedKey);
    if (cryptedKey[0] & 0x80) {
        subkey1 = xor(subkey1, rb);
    }

    let subkey2 = bitShiftLeft(subkey1);
    if (subkey1[0] & 0x80) {
        subkey2 = xor(subkey2, rb);
    }

    return { subkey1: subkey1, subkey2: subkey2 };
}

function bitShiftLeft(buffer) {
    const shifted = Buffer.alloc(buffer.length);
    const last = buffer.length - 1;

    for (let index = 0; index < last; index++) {
        let value = buffer[index] << 1;

        if (buffer[index + 1] & 0x80) {
            value += 0x01;
        }

        shifted[index] = value;
    }

    shifted[last] = buffer[last] << 1;

    return shifted;
}

function xor(bufferA, bufferB) {
    const length = Math.min(bufferA.length, bufferB.length);
    const output = Buffer.alloc(length);

    for (let index = 0; index < length; index++) {
        const value = bufferA[index] ^ bufferB[index];
        output[index] = value;
    }

    return output;
}

function aes(key, message) {
    const iv = Utils.convertToByteString("00000000000000000000000000000000", "Hex")
    const cipher = forge.cipher.createCipher("AES-CBC", key);
    cipher.start({
        iv: iv
    });
    cipher.update(forge.util.createBuffer(message));
    cipher.finish();
    const cipher_result = cipher.output.toHex()

    // slicing because of forge library AES CBC mode default padding 
    const half_length = Math.ceil(cipher_result.length / 2);    
    return cipher_result.slice(0,half_length);
}

function getMessageBlock(message, blockIndex, padded) {
	const block = Buffer.alloc(blockSize);
	const start = blockIndex * blockSize;
	const end = start + blockSize;
    const message_buffer = Buffer(message);
	
	if (padded) {
		block.fill(0);
		message_buffer.copy(block, 0, start, end);
		block[end - start] = 0x80;
	} else {
		message_buffer.copy(block, 0, start, end);
	}

	return block;
}

export default CmacAes;
