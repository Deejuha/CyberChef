/**
 * @author Michal Juszczyk [michaljuszczyk2@gmail.com]
 */

import Operation from "../Operation.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";

class CmacAes extends Operation
{
    constructor() 
    {
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
            "value": ["Hex"]
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
    run(input, args)
    {
        var key = Utils.convertToByteArray(args[0].string, args[0].option)
        if ([16, 24, 32].indexOf(key.length) < 0) {
            throw new OperationError(`Invalid key length: ${key.length} bytes.
Shall be 16, 24 or 32 bytes.`);
        }
        var cmac_input = Utils.convertToByteArray(input, "hex")
        var aesCmac = require("node-aes-cmac").aesCmac;
        // return "" + key.length + "\n" + Buffer(key)
        return aesCmac(Buffer(key), Buffer(cmac_input));
    }
}

export default CmacAes;
