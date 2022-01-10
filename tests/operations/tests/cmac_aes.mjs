/**
 * CMAC-AES tests.
 * @author Michal Juszczyk [michaljuszczyk2@gmail.com]
 */
import TestRegister from "../../lib/TestRegister.mjs";

TestRegister.addTests([
    {
        name: "CMAC AES: NIST Test Vector 1 - Message len 0.",
        input: "",
        expectedOutput: "bb1d6929e95937287fa37d129b756746",
        recipeConfig:
            [
                {
                    "op": "CMAC AES",
                    "args":
                        ["2b7e151628aed2a6abf7158809cf4f3c", "hex", "hex", "hex"],
                },
            ],
    },
    {
        name: "CMAC AES: NIST Test Vector 2 - Message len 16.",
        input: "6bc1bee22e409f96e93d7e117393172a",
        expectedOutput: "070a16b46b4d4144f79bdd9dd04a287c",
        recipeConfig:
            [
                {
                    "op": "CMAC AES",
                    "args":
                        ["2b7e151628aed2a6abf7158809cf4f3c", "hex", "hex", "hex"]
                },
            ],
    },
    {
        name: "CMAC AES: NIST Test Vector 3 - Message len 40.",
        input: "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411",
        expectedOutput: "dfa66747de9ae63030ca32611497c827",
        recipeConfig:
            [
                {
                    "op": "CMAC AES",
                    "args": ["2b7e151628aed2a6abf7158809cf4f3c", "hex", "hex", "hex"]
                },
            ],
    },
    {
        name: "CMAC AES: NIST Test Vector 4 - Message len 64.",
        input: "6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411e5fbc1191a0a52eff69f2445df4f9b17ad2b417be66c3710",
        expectedOutput: "51f0bebf7e3b9d92fc49741779363cfe",
        recipeConfig: [
            {
                "op": "CMAC AES",
                "args": ["2b7e151628aed2a6abf7158809cf4f3c", "hex", "hex", "hex"]
            },
        ],
    },
]);
