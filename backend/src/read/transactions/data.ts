const ABI = [
    {
        "inputs": [],
        "name": "Banned",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            }
        ],
        "name": "DungeonAlreadyCompleted",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            }
        ],
        "name": "DungeonExpired",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerDungeonTriggerEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonMapAlreadyUnlockedForPlayer",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "expected",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "actual",
                "type": "uint256"
            }
        ],
        "name": "DungeonMapEntityMismatch",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerDungeonTriggerEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonMapLockedForPlayer",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "mapEntity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            }
        ],
        "name": "DungeonMapNotFound",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "mapEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonMapNotLocked",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "encounterEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonNodeAlreadyCompleted",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "encounterEntity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "givenBattleEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonNodeBattleEntityMismatch",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "encounterEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonNodeNotStarted",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "encounterEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonNodeOutOfOrder",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "encounterEntity",
                "type": "uint256"
            }
        ],
        "name": "DungeonNodePreviousNotCompleted",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            }
        ],
        "name": "DungeonNotAvailable",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "gameRegistry",
                "type": "address"
            }
        ],
        "name": "InvalidGameRegistry",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidInputs",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "expectedRole",
                "type": "bytes32"
            }
        ],
        "name": "MissingRole",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "battleEntity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "scheduledStartTimestamp",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "mapEntity",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "node",
                "type": "uint256"
            }
        ],
        "name": "DungeonLootGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint8",
                "name": "version",
                "type": "uint8"
            }
        ],
        "name": "Initialized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Paused",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "Unpaused",
        "type": "event"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "battleEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "scheduledStart",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "mapEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "encounterEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "internalType": "struct EndDungeonBattleParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "endDungeonBattle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "requestId",
                "type": "uint256"
            },
            {
                "internalType": "uint256[]",
                "name": "randomWords",
                "type": "uint256[]"
            }
        ],
        "name": "fulfillRandomWordsCallback",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "dungeonScheduledStart",
                "type": "uint256"
            }
        ],
        "name": "getCurrentPlayerState",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "enum DungeonNodeProgressState",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "mapEntity",
                "type": "uint256"
            }
        ],
        "name": "getDungeonMapById",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "nodeId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "enemies",
                                "type": "uint256[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ILootSystemV2.LootType",
                                        "name": "lootType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "lootEntity",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "amount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct ILootSystemV2.Loot[]",
                                "name": "loots",
                                "type": "tuple[]"
                            }
                        ],
                        "internalType": "struct DungeonNode[]",
                        "name": "nodes",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct DungeonMap",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduleIdx",
                "type": "uint256"
            }
        ],
        "name": "getDungeonMapByScheduleIndex",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "nodeId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256[]",
                                "name": "enemies",
                                "type": "uint256[]"
                            },
                            {
                                "components": [
                                    {
                                        "internalType": "enum ILootSystemV2.LootType",
                                        "name": "lootType",
                                        "type": "uint8"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "lootEntity",
                                        "type": "uint256"
                                    },
                                    {
                                        "internalType": "uint256",
                                        "name": "amount",
                                        "type": "uint256"
                                    }
                                ],
                                "internalType": "struct ILootSystemV2.Loot[]",
                                "name": "loots",
                                "type": "tuple[]"
                            }
                        ],
                        "internalType": "struct DungeonNode[]",
                        "name": "nodes",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct DungeonMap",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "encounterEntity",
                "type": "uint256"
            }
        ],
        "name": "getDungeonNode",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "nodeId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "enemies",
                        "type": "uint256[]"
                    },
                    {
                        "components": [
                            {
                                "internalType": "enum ILootSystemV2.LootType",
                                "name": "lootType",
                                "type": "uint8"
                            },
                            {
                                "internalType": "uint256",
                                "name": "lootEntity",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct ILootSystemV2.Loot[]",
                        "name": "loots",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct DungeonNode",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduleIdx",
                "type": "uint256"
            }
        ],
        "name": "getDungeonTriggerByIndex",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "dungeonMapEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DungeonTrigger",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "scheduledStart",
                "type": "uint256"
            }
        ],
        "name": "getDungeonTriggerByStartTimestamp",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "dungeonMapEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "endAt",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "startAt",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DungeonTrigger",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getExtraTimeForDungeonCompletion",
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
        "inputs": [],
        "name": "getGameRegistry",
        "outputs": [
            {
                "internalType": "contract IGameRegistry",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getId",
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
                "name": "gameRegistryAddress",
                "type": "address"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "dungeonScheduledStart",
                "type": "uint256"
            }
        ],
        "name": "isDungeonMapCompleteForAccount",
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
                "name": "forwarder",
                "type": "address"
            }
        ],
        "name": "isTrustedForwarder",
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
        "name": "paused",
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
                "name": "gameRegistryAddress",
                "type": "address"
            }
        ],
        "name": "setGameRegistry",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bool",
                "name": "shouldPause",
                "type": "bool"
            }
        ],
        "name": "setPaused",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "battleSeed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "scheduledStart",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "mapEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "encounterEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "shipEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "shipOverloads",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "internalType": "struct StartAndEndDungeonBattleParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "startAndEndDungeonBattle",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "battleSeed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "scheduledStart",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "mapEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "encounterEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "shipEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "shipOverloads",
                        "type": "uint256[]"
                    },
                    {
                        "internalType": "bool",
                        "name": "success",
                        "type": "bool"
                    }
                ],
                "internalType": "struct StartAndEndDungeonBattleParams",
                "name": "params",
                "type": "tuple"
            },
            {
                "internalType": "string",
                "name": "ipfsUrl",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "operatorWallet",
                "type": "address"
            }
        ],
        "name": "startAndEndValidatedDungeonBattle",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "battleSeed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "scheduledStart",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "mapEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "encounterEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "shipEntity",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "shipOverloads",
                        "type": "uint256[]"
                    }
                ],
                "internalType": "struct StartDungeonBattleParams",
                "name": "params",
                "type": "tuple"
            }
        ],
        "name": "startDungeonBattle",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "mapEntity",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "scheduledStart",
                "type": "uint256"
            }
        ],
        "name": "unlockDungeonMap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const Activities = [{
    address: "0xD4a3f1D145C185E222cCC03D60A1D9fB5e0c2048",
    playerAddressVariable: "operatorWallet",
    functionName: "startAndEndValidatedDungeonBattle",
    goal: 2,
    players: ["0x95ff309e997b0b194978e8f52601a278574624aa", "0xfe8c64cd90645b635e6880f0e6c2fe1c1b9316eb"],
    found: {
       "0x95ff309e997b0b194978e8f52601a278574624aa": 0,
        "0xfe8c64cd90645b635e6880f0e6c2fe1c1b9316eb": 1
    },
    abi: ABI
}, {
    address: "0xD4a3f1D145C185E222cCC03D60A1D9fB5e0c2048",
    playerAddressVariable: "operatorWallet",
    functionName: "startAndEndValidatedDungeonBattle",
    goal: 3,
    players: ["0xc09f6450513aad3fddc6312c997bfa6806b195f9", "0x5aba9e1145d723eb2ef53e34f7eeef74aa9923c1"],
    found: {
       "0xc09f6450513aad3fddc6312c997bfa6806b195f9": 1,
       "0x5aba9e1145d723eb2ef53e34f7eeef74aa9923c1": 1
    },
    abi: ABI
}]