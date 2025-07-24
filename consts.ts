export const SILIQUAE_PER_UNUM = 1728;

/**
 * The smallest difference representable between two roman numerals.
 */
export const RES_MINIMA = 1 / SILIQUAE_PER_UNUM;

export const VINCULUM = '\u0305';
export const MILLE = 'M';
export const QUINGENTI = 'D';
export const CENTUM = 'C';
export const QUINQUAGINTA = 'L';
export const DECEM = 'X';
export const QUINQUE = 'V';
export const UNUS = 'I';
export const SEMIS = 'S';
export const UNCIAE = ['·', ':', '∴', '∷', '⁙'];
export const SEMUNCIA = 'Σ';
export const SICILICUS = 'Ↄ';
export const SEXTULA = 'Ƨ';
export const DIMIDIA_SEXTULA = 'Ƶ';
export const SCRIPULUM = '℈';
export const SILIQUA = '⸩';
export const NULLE = 'N';
/**
 * largest number we can encode
 */
export const NUMERUS_MAXIMUS = 3_999_999 + RES_MINIMA + RES_MINIMA / 2;