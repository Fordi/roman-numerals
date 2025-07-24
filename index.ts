import { NUMERALS } from "./generated/NUMERALS.js";
import {
  CENTUM,
  DECEM,
  DIMIDIA_SEXTULA,
  MILLE,
  NULLE,
  NUMERUS_MAXIMUS,
  QUINGENTI,
  QUINQUAGINTA,
  QUINQUE,
  RES_MINIMA,
  SCRIPULUM,
  SEMIS,
  SEMUNCIA,
  SEXTULA,
  SICILICUS,
  SILIQUA,
  SILIQUAE_PER_UNUM,
  UNCIAE,
  UNUS,
  VINCULUM,
} from "./consts.js";

export {
  CENTUM,
  DECEM,
  DIMIDIA_SEXTULA,
  MILLE,
  NULLE,
  NUMERALS,
  NUMERUS_MAXIMUS,
  QUINGENTI,
  QUINQUAGINTA,
  QUINQUE,
  RES_MINIMA,
  SCRIPULUM,
  SEMIS,
  SEMUNCIA,
  SEXTULA,
  SICILICUS,
  SILIQUA,
  SILIQUAE_PER_UNUM,
  UNCIAE,
  UNUS,
  VINCULUM,
};

const MILLE_SANS_CENTUM_VINCULUM_RX = new RegExp(
  `(?<!${CENTUM})${MILLE}(?!${VINCULUM})`,
  "g"
);
const WHITESPACE = /\s/g;
const SEMEL_MILLE_RX = new RegExp(`${UNUS}${VINCULUM}`, "g");

/**
 * @param numeral a valid symbol in roman numerals
 * @param siliquae The value of the symbol, in Siliquae, or 1/1728
 * @param unae The unit value of the symbol, in floating point unae (units, 1)
 * @returns
 * - `undefined` to continue
 * - `true` to be done for the current order of magnitude
 * - `false` to be done altogether
 */
export type NumeralIterator = (
  numeral: string,
  siliquae: number,
  unae: number
) => boolean | undefined;

/**
 * Iterates over each possible roman numeral token in descending order
 * @param iterator What to do for each numeral.  Returns false
 */
export function forEachNumeral(fn: NumeralIterator) {
  forOrder: for (const [order, numerals] of NUMERALS) {
    for (let i = numerals.length - 1; i >= 0; i--) {
      const numeral = numerals[i];
      const siliquae = (i + 1) * order;
      const unciae = siliquae * RES_MINIMA;
      const result = fn(numeral, siliquae, unciae);
      if (result === true) {
        continue forOrder;
      }
      if (result === false) {
        return;
      }
    }
  }
}

/**
 * Parse a roman numeral
 * @param numeral A string containing a roman numeral, optionally with whitespace
 * @returns the number the numeral represents
 */
export function fromRoman(numeral: string) {
  // I̅ and M are equivalent, but the parser will get confused if M is used for 1,000
  // The regexp replaces all `M` that is not part of `CM` or `M̅` with I̅
  let str = numeral
    .replace(WHITESPACE, "")
    .replace(MILLE_SANS_CENTUM_VINCULUM_RX, `${UNUS}${VINCULUM}`);
  let sum = 0;
  let last = "";
  forEachNumeral((symbol, siliquae) => {
    if (str.startsWith(symbol)) {
      last = str.slice(0, symbol.length);
      str = str.slice(symbol.length);
      sum += siliquae;
      return true;
    }
  });
  if (str !== "") {
    throw new Error(
      `Invalid roman numeral: ${numeral}; ${str.slice(
        0,
        1
      )} can't be after ${last} at index ${
        numeral.length - str.length
      } (${str} remains)`
    );
  }
  return sum * RES_MINIMA;
}

/**
 * How to format the roman numeral
 */
type RomanNumeralOptions = {
  /**
   * A separator to include between orders of magnitude
   */
  spacing?: string;
  /**
   * Include support for fractions
   */
  fractions?: boolean;
};

/**
 * Compose a roman numeral from a number
 * @param number The number to convert
 * @param spacing Spacing to place between orders of magnitude
 * @param fractions Whether to encode fractions
 * @returns The composed roman numeral
 */
export function toRoman(
  number: number,
  { spacing = "", fractions = false }: RomanNumeralOptions = {}
) {
  if (number > NUMERUS_MAXIMUS) {
    throw new Error(`Cannot encode numbers > ${NUMERUS_MAXIMUS}`);
  }
  if (number < 0) {
    throw new Error(`Cannot encode negative numbers`);
  }
  // As a non-positional numeral system, Roman numerals have no "place-keeping" zeros. ... About
  // 725, Bede or one of his colleagues used the letter N, the initial of nulla or of nihil (the
  // Latin word for "nothing") for 0
  // https://en.wikipedia.org/wiki/Roman_numerals#Zero
  if (number === 0) {
    return NULLE;
  }
  let num = Math.round(number * SILIQUAE_PER_UNUM);
  const buf: string[] = [];
  forEachNumeral((numeral, value) => {
    if (!fractions && value < SILIQUAE_PER_UNUM) {
      return false;
    }
    if (num < value) {
      return;
    }
    buf.push(numeral);
    num -= value;
    if (num < 1) {
      return false;
    }
    return true;
  });
  const result = buf.join(spacing);

  // for numerals < 4000, we want to just use M instead of I̅
  if (number < 4000) {
    return result.replace(SEMEL_MILLE_RX, MILLE);
  }
  return result;
}
