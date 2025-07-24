import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  CENTUM,
  DECEM,
  DIMIDIA_SEXTULA,
  MILLE,
  QUINGENTI,
  QUINQUAGINTA,
  QUINQUE,
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
  // @ts-expect-error ts-node handles this incorrectly; should be consts.js to be consistent
} from "../consts.ts";

const TEMPLATE = [
  [
    "// This file is generated.  If you change the values of the named constants in `roman.ts`, ",
    "//  re-run `npm build:numerals` to generate this.",
    "export const NUMERALS: [value: number, numerals: string[]][] = [",
  ],
  ["];"],
];

// Repeat a string n times
const rep = (v: string, n: number) => new Array(n).fill(v).join("");

// Repeat a string (x=1..n) x times, e.g., reps('I', 3) -> ['I', 'II', 'III']
const reps = (v: string, n: number) =>
  new Array(n).fill(0).map((_, i) => rep(v, i + 1));

// Add a vinculum (overline) to each character in a string.
const vinculum = (s: string) => [...s].map((c) => `${c}${VINCULUM}`).join("");

// Create a 9-element standard set, e.g., [I, II, III, IV, V, VI, VII, VIII, IX]
const standard = (
  one: string,
  five: string,
  ten: string,
  pre: (k: string) => string = (k) => k
) => {
  [one, five, ten] = [pre(one), pre(five), pre(ten)];
  return [
    ...reps(one, 3),
    `${one}${five}`,
    five,
    ...reps(one, 3).map((r) => `${five}${r}`),
    `${one}${ten}`,
  ];
};

const NUMERALS: [value: number, numerals: string[]][] = [
  // Going with the terser Vinculum method, rather than the decidedly verbose Apostrophus method.
  // https://en.wikipedia.org/wiki/Roman_numerals#Vinculum
  [SILIQUAE_PER_UNUM * 10e5, reps(vinculum(MILLE), 3)],
  [SILIQUAE_PER_UNUM * 10e4, standard(CENTUM, QUINGENTI, MILLE, vinculum)],
  [SILIQUAE_PER_UNUM * 10e3, standard(DECEM, QUINQUAGINTA, CENTUM, vinculum)],
  [SILIQUAE_PER_UNUM * 10e2, standard(UNUS, QUINQUE, DECEM, vinculum)],

  // Standard numerals
  [SILIQUAE_PER_UNUM * 10e1, standard(CENTUM, QUINGENTI, MILLE)],
  [SILIQUAE_PER_UNUM * 10, standard(DECEM, QUINQUAGINTA, CENTUM)],
  [SILIQUAE_PER_UNUM, standard(UNUS, QUINQUE, DECEM)],

  // Every fraction I could possibly render
  // https://en.wikipedia.org/wiki/Roman_numerals#Fractions
  [SILIQUAE_PER_UNUM / 2, [SEMIS]],
  [SILIQUAE_PER_UNUM / 2 / 6, UNCIAE],
  [SILIQUAE_PER_UNUM / 2 / 6 / 2, [SEMUNCIA]],
  [SILIQUAE_PER_UNUM / 2 / 6 / 3, reps(SICILICUS, 2)],
  [SILIQUAE_PER_UNUM / 2 / 6 / 3 / 2, [SEXTULA]],
  [SILIQUAE_PER_UNUM / 2 / 6 / 3 / 2 / 2, [DIMIDIA_SEXTULA]],
  [SILIQUAE_PER_UNUM / 2 / 6 / 3 / 2 / 2 / 2, [SCRIPULUM]],
  [1, reps(SILIQUA, 5)],
];

function formatNumerals() {
  const buf: string[] = [];
  for (const [spu, symbols] of NUMERALS) {
    buf.push(
      `  [${spu}, ${JSON.stringify(symbols).replace(/","/g, '", "')}],`
    );
  }
  return [...TEMPLATE[0], ...buf, ...TEMPLATE[1]].join("\n") + "\n";
}

writeFileSync(
  fileURLToPath(new URL("../generated/NUMERALS.ts", import.meta.url)),
  formatNumerals(),
  "utf-8"
);
