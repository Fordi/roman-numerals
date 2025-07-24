import { describe, it } from "node:test";
import { AssertionError, equal, throws } from "node:assert";

import { fromRoman, RES_MINIMA, toRoman, NUMERUS_MAXIMUS } from "./dist/index.js";

// TODO: This should be a library function
const withinTolerance = (tolerance: number = Number.EPSILON) => {
  class ToleranceError extends AssertionError {
    tolerance = tolerance;
  }
  return (actual: number, expected: number) => {
    if (Math.abs(actual - expected) > tolerance) {
      throw Object.assign(new ToleranceError({
        actual,
        expected,
        operator: '≅',
      }));
    }
  }
};

const withinResMinima = withinTolerance(RES_MINIMA / 2);

describe("toRoman", () => {
  it("generates roman numerals", () => {
    equal(toRoman(1984, { spacing: ' ' }), "M CM LXXX IV");
  });
  it("generates roman numerals over 3,999", () => {
    equal(toRoman(1_234_567, { spacing: ' ' }), "M̅ C̅C̅ X̅X̅X̅ I̅V̅ D LX VII");
  });
  it("does not generate fractions unless asked", () => {
    equal(toRoman(Math.PI), "III");
  });
  it("generates fractions", () => {
    equal(toRoman(1.25, { spacing: ' ', fractions: true }), "I ∴");
    equal(toRoman(4/3, { fractions: true }), "I∷");
    equal(toRoman(100.875, { fractions: true }), "CS∷Σ");
    equal(toRoman(Math.PI, { fractions: true }), "III·ΣƧ⸩⸩⸩⸩⸩");
  });
  it("throws for numbers too large", () => {
    throws(() => toRoman(NUMERUS_MAXIMUS + 1));
  });
  it("throws for negative numbers", () => {
    throws(() => toRoman(-1));
  });
  it("returns NULLE for 0", () => {
    equal(toRoman(0), "N");
  });
});

describe("fromRoman", () => {
  it("parses a roman numeral", () => {
    equal(fromRoman("M CM LX III"), 1963);
  });
  it("parses roman numerals over 3,999", () => {
    equal(fromRoman('M̅M̅ C̅M̅ X̅L̅ V̅I̅I̅ D LX IX'), 2_947_569);
  });
  it("parses roman numerals with fractions", () => {
    withinResMinima(fromRoman('IIS:ΣƵ⸩⸩⸩⸩⸩'), Math.E);
    equal(fromRoman("I∴"), 1.25);
    equal(fromRoman("I·Ↄ"), 10/9);
    equal(fromRoman("CIVS"), 104.5);
  });
  it("throws for bad roman numerals", () => {
    throws(() => fromRoman("CMCMCMC"))
  });
});

it("handles a stress test", () => {
  for (let i = 0; i < 1000; i++) {
    const number = Math.floor(Math.random() * 4_000_000);
    const roman = toRoman(number);
    const expected = fromRoman(roman);
    equal(number, expected);
  }
});

it("handles a floating point stress test", () => {
  for (let i = 0; i < 1000; i++) {
    const number = Math.random() * 4_000_000;
    const roman = toRoman(number, { fractions: true, spacing: i % 2 ? ' ' : '' });
    const expected = fromRoman(roman);
    withinResMinima(number, expected);
  }
});
