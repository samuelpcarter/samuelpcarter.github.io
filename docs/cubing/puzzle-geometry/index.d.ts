import { P as Perm } from '../PuzzleLoader-DWqO9l1G.js';
export { q as EXPERIMENTAL_PUZZLE_BASE_SHAPES, n as EXPERIMENTAL_PUZZLE_CUT_TYPES, k as ExperimentalPGNotation, r as ExperimentalPuzzleBaseShape, l as ExperimentalPuzzleCutDescription, o as ExperimentalPuzzleCutType, m as ExperimentalPuzzleDescription, j as ExperimentalPuzzleGeometryOptions, d as PuzzleGeometry, Q as Quat, S as StickerDat, e as StickerDatAxis, f as StickerDatFace, h as StickerDatSticker, c as getPG3DNamedPuzzles, g as getPuzzleDescriptionString, a as getPuzzleGeometryByDesc, b as getPuzzleGeometryByName, i as parseOptions, p as parsePuzzleDescription } from '../PuzzleLoader-DWqO9l1G.js';
import 'three/src/Three.js';

declare function schreierSims(g: Perm[], disp: (s: string) => void): bigint;

export { schreierSims };
