CONTRACT_ADDRESS = '0xb01e92b6c7897fc8511e2e1aaac8f34987a19f89'
CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "herbName",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "indexed": False,
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "BatchRegistered",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "farmerName",
                "type": "string"
            }
        ],
        "name": "FarmerVerified",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "indexed": True,
                "internalType": "address",
                "name": "processor",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "stepDescription",
                "type": "string"
            },
            {
                "indexed": False,
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "ProcessingStepAdded",
        "type": "event"
    },
    {
        "anonymous": False,
        "inputs": [
            {
                "indexed": True,
                "internalType": "address",
                "name": "processor",
                "type": "address"
            },
            {
                "indexed": False,
                "internalType": "string",
                "name": "processorName",
                "type": "string"
            }
        ],
        "name": "ProcessorVerified",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_processorName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_stepDescription",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_location",
                "type": "string"
            }
        ],
        "name": "addProcessingStep",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "addVerifiedFarmer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_processor",
                "type": "address"
            }
        ],
        "name": "addVerifiedProcessor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "allBatchIds",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "batches",
        "outputs": [
            {
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "farmerName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbType",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "collectionTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "qualityGrade",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "additionalNotes",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "farmerBatches",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllBatchIds",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "getBatchDetails",
        "outputs": [
            {
                "internalType": "string",
                "name": "batchId",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "farmer",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "farmerName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "herbType",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "collectionTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "qualityGrade",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "isVerified",
                "type": "bool"
            },
            {
                "internalType": "string",
                "name": "additionalNotes",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "getBatchLocation",
        "outputs": [
            {
                "internalType": "int256",
                "name": "latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "longitude",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "getFarmerBatches",
        "outputs": [
            {
                "internalType": "string[]",
                "name": "",
                "type": "string[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "getProcessingHistory",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "processor",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "processorName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "stepDescription",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "location",
                        "type": "string"
                    }
                ],
                "internalType": "struct HerbalTraceability.ProcessingStep[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalBatches",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_farmer",
                "type": "address"
            }
        ],
        "name": "isVerifiedFarmer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_processor",
                "type": "address"
            }
        ],
        "name": "isVerifiedProcessor",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "processingHistory",
        "outputs": [
            {
                "internalType": "address",
                "name": "processor",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "processorName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "stepDescription",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "location",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_farmerName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_herbName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_herbType",
                "type": "string"
            },
            {
                "internalType": "int256",
                "name": "_latitude",
                "type": "int256"
            },
            {
                "internalType": "int256",
                "name": "_longitude",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "_quantity",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_qualityGrade",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_additionalNotes",
                "type": "string"
            }
        ],
        "name": "registerBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedFarmers",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "verifiedProcessors",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_batchId",
                "type": "string"
            }
        ],
        "name": "verifyBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
