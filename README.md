# @fordi-org/roman-numerals

Parse and encode roman numerals with as much support as possible

[API documentation](./API.md)

## Examples of use

```javascript
toRoman(2025);

> "MXXV"

toRoman(Math.PI, { fractions: true });

> "III·ΣƧ⸩⸩⸩⸩⸩"


fromRoman("MM");

> 2000
```
