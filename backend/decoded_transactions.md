# Output of decoding transcations

## Crafting Items Transaction

(This is a forwarded by PopForwarder so I ended up decoding the input arguement of the contract call)
**Transaction Hash of Decoded transaction** -> 0x46f4773a6facc6e67b076607633bfd468da30a1d8ac9cb458b5298bb0ad9260e
**Forwarded Contract Address** -> 0xe6Cc6541A4A406DC5d310e4C8a72CC72d23757ef
**ABI** 

```json
[{"inputs":[{"internalType":"address","name":"caller","type":"address"},{"internalType":"address","name":"owner","type":"address"}],"name":"CallerNotOwner","type":"error"},{"inputs":[],"name":"EmptyTransformArray","type":"error"},{"inputs":[{"internalType":"uint256","name":"expected","type":"uint256"},{"internalType":"uint256","name":"actual","type":"uint256"}],"name":"InputLengthMismatch","type":"error"},{"inputs":[],"name":"InvalidERC20Input","type":"error"},{"inputs":[],"name":"InvalidERC721Input","type":"error"},{"inputs":[{"internalType":"address","name":"gameRegistry","type":"address"}],"name":"InvalidGameRegistry","type":"error"},{"inputs":[],"name":"InvalidInputTokenType","type":"error"},{"inputs":[{"internalType":"uint256","name":"transformInstanceEntity","type":"uint256"},{"internalType":"uint16","name":"numSuccess","type":"uint16"},{"internalType":"uint16","name":"maxSuccess","type":"uint16"}],"name":"InvalidNumSuccess","type":"error"},{"inputs":[],"name":"InvalidRandomWord","type":"error"},{"inputs":[{"internalType":"uint256","name":"runnerEntity","type":"uint256"}],"name":"InvalidRunner","type":"error"},{"inputs":[],"name":"MissingInputsOrOutputs","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"bytes32","name":"expectedRole","type":"bytes32"}],"name":"MissingRole","type":"error"},{"inputs":[{"internalType":"uint256","name":"transformEntity","type":"uint256"}],"name":"NoTransformRunners","type":"error"},{"inputs":[{"internalType":"address","name":"tokenContract","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"NotOwner","type":"error"},{"inputs":[{"internalType":"address","name":"expected","type":"address"},{"internalType":"address","name":"actual","type":"address"}],"name":"TokenContractNotMatching","type":"error"},{"inputs":[{"internalType":"uint256","name":"expected","type":"uint256"},{"internalType":"uint256","name":"actual","type":"uint256"}],"name":"TokenIdNotMatching","type":"error"},{"inputs":[{"internalType":"enum ILootSystemV2.LootType","name":"expected","type":"uint8"},{"internalType":"enum ILootSystemV2.LootType","name":"actual","type":"uint8"}],"name":"TokenTypeNotMatching","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"transformEntity","type":"uint256"}],"name":"TransformNotAvailable","type":"error"},{"inputs":[{"internalType":"uint256","name":"transformInstanceEntity","type":"uint256"}],"name":"TransformNotCompleteable","type":"error"},{"inputs":[],"name":"ZeroParamCount","type":"error"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint8","name":"version","type":"uint8"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"inputs":[{"internalType":"uint256[]","name":"transformInstanceEntities","type":"uint256[]"}],"name":"batchCompleteTransform","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"transformInstanceEntity","type":"uint256"}],"name":"completeTransform","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"transformInstanceEntity","type":"uint256"},{"internalType":"address","name":"account","type":"address"}],"name":"completeTransformWithAccount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getGameRegistry","outputs":[{"internalType":"contract IGameRegistry","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"gameRegistryAddress","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"components":[{"internalType":"uint256","name":"transformEntity","type":"uint256"},{"components":[{"internalType":"enum ILootSystemV2.LootType","name":"lootType","type":"uint8"},{"internalType":"uint256","name":"lootEntity","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ILootSystemV2.Loot[]","name":"inputs","type":"tuple[]"},{"internalType":"uint16","name":"count","type":"uint16"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct TransformParams","name":"params","type":"tuple"}],"name":"isTransformAvailable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"transformInstanceEntity","type":"uint256"}],"name":"isTransformCompleteable","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"forwarder","type":"address"}],"name":"isTrustedForwarder","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"requestId","type":"uint256"},{"internalType":"uint256","name":"randomNumber","type":"uint256"}],"name":"randomNumberCallback","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"gameRegistryAddress","type":"address"}],"name":"setGameRegistry","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"shouldPause","type":"bool"}],"name":"setPaused","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"transformEntity","type":"uint256"},{"components":[{"internalType":"enum ILootSystemV2.LootType","name":"lootType","type":"uint8"},{"internalType":"uint256","name":"lootEntity","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ILootSystemV2.Loot[]","name":"inputs","type":"tuple[]"},{"internalType":"uint16","name":"count","type":"uint16"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct TransformParams","name":"params","type":"tuple"}],"name":"startTransform","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"transformEntity","type":"uint256"},{"components":[{"internalType":"enum ILootSystemV2.LootType","name":"lootType","type":"uint8"},{"internalType":"uint256","name":"lootEntity","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct ILootSystemV2.Loot[]","name":"inputs","type":"tuple[]"},{"internalType":"uint16","name":"count","type":"uint16"},{"internalType":"bytes","name":"data","type":"bytes"}],"internalType":"struct TransformParams","name":"params","type":"tuple"},{"internalType":"address","name":"account","type":"address"}],"name":"startTransformWithAccount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]
```

**Decoded output**

```javascript
{
  '0': [
    89834039095319845214506777991554353706705168260911549170910077622560332078713n
  ],
  __length__: 1,
  transformInstanceEntities: [
    89834039095319845214506777991554353706705168260911549170910077622560332078713n
  ],
  __method__: 'batchCompleteTransform(uint256[])'
}
```

## Picking Up Items Transaction

(This is forwarded by PopForwarder so I ended up decoding the input arguement of the contract call)
**Transaction hash of decoded transaction** -> 0x5889dc3430d63326c44b5fc2dffbf17b99606c2489b4307e2945abaa0258de5b
**Forwaded contract address** -> 0xe6Cc6541A4A406DC5d310e4C8a72CC72d23757ef
**ABI**

(ABI is the same as the one for crafting item)

**Decoded transaction**

```javascript
{
  "0": {
    "0": "65985647897536628522778471584909294190155480242358280953440680668837951867294",
    "1": [
      {
        "0": "2",
        "1": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "2": "1",
        "__length__": 3,
        "lootType": "2",
        "lootEntity": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "amount": "1"
      }
    ],
    "2": "1",
    "3": "0x",
    "__length__": 4,
    "transformEntity": "65985647897536628522778471584909294190155480242358280953440680668837951867294",
    "inputs": [
      {
        "0": "2",
        "1": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "2": "1",
        "__length__": 3,
        "lootType": "2",
        "lootEntity": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "amount": "1"
      }
    ],
    "count": "1",
    "data": "0x"
  },
  "__length__": 1,
  "params": {
    "0": "65985647897536628522778471584909294190155480242358280953440680668837951867294",
    "1": [
      {
        "0": "2",
        "1": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "2": "1",
        "__length__": 3,
        "lootType": "2",
        "lootEntity": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "amount": "1"
      }
    ],
    "2": "1",
    "3": "0x",
    "__length__": 4,
    "transformEntity": "65985647897536628522778471584909294190155480242358280953440680668837951867294",
    "inputs": [
      {
        "0": "2",
        "1": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "2": "1",
        "__length__": 3,
        "lootType": "2",
        "lootEntity": "1906095189314217384240960817313607732492074601154461341919454707972530450",
        "amount": "1"
      }
    ],
    "count": "1",
    "data": "0x"
  },
  "__method__": "startTransform((uint256,(uint8,uint256,uint256)[],uint16,bytes))"
}
```



