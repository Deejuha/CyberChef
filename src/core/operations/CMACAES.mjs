/**
 * @author Michal Juszczyk [michaljuszczyk2@gmail.com]
 * @copyright Crown Copyright 2021
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";

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
            "toggleValues": ["Hex"]
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
        return "it works!";
    }
}

export default CmacAes;
