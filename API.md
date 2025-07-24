## Functions

- [forEachNumeral](#foreachnumeral)
- [fromRoman](#fromroman)
- [toRoman](#toroman)

### forEachNumeral

Iterates over each possible roman numeral token in descending order

| Function | Type |
| ---------- | ---------- |
| `forEachNumeral` | `(fn: NumeralIterator) => void` |

Parameters:

* `iterator`: What to do for each numeral.  Returns false


### fromRoman

Parse a roman numeral

| Function | Type |
| ---------- | ---------- |
| `fromRoman` | `(numeral: string) => number` |

Parameters:

* `numeral`: A string containing a roman numeral, optionally with whitespace


Returns:

the number the numeral represents

### toRoman

Compose a roman numeral from a number

| Function | Type |
| ---------- | ---------- |
| `toRoman` | `(number: number, { spacing, fractions }?: RomanNumeralOptions) => string` |

Parameters:

* `number`: The number to convert
* `spacing`: Spacing to place between orders of magnitude
* `fractions`: Whether to encode fractions


Returns:

The composed roman numeral



## Types

- [NumeralIterator](#numeraliterator)

### NumeralIterator

| Type | Type |
| ---------- | ---------- |
| `NumeralIterator` | `( numeral: string, siliquae: number, unae: number ) => boolean or undefined` |

Parameters:

* `numeral`: a valid symbol in roman numerals
* `siliquae`: The value of the symbol, in Siliquae, or 1/1728
* `unae`: The unit value of the symbol, in floating point unae (units, 1)


Returns:

- `undefined` to continue
- `true` to be done for the current order of magnitude
- `false` to be done altogether

