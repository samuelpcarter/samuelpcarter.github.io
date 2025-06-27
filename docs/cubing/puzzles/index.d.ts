import { u as PuzzleID, t as PuzzleLoader, v as KPuzzle, d as PuzzleGeometry, E as ExperimentalStickering, w as StickeringMask, x as PuzzleSpecificSimplifyOptions, A as AlgLeaf } from '../PuzzleLoader-DWqO9l1G.js';
import 'three/src/Three.js';

interface EventInfo {
    puzzleID: PuzzleID;
    eventName: string;
}
declare const wcaEvents: Record<string, EventInfo>;
/** @category Event Info */
declare function wcaEventInfo(event: string): EventInfo | null;
declare const twizzleEvents: Record<string, EventInfo>;
/** @category Event Info */
declare function eventInfo(event: string): EventInfo | null;

/** @category Specific Puzzles */
declare const cube2x2x2: PuzzleLoader;

/** @category Specific Puzzles */
declare const cube3x3x3: {
    id: string;
    fullName: string;
    inventedBy: string[];
    inventionYear: number;
    kpuzzle: () => Promise<KPuzzle>;
    svg: () => Promise<string>;
    llSVG: () => Promise<string>;
    llFaceSVG: () => Promise<string>;
    pg: () => Promise<PuzzleGeometry>;
    stickeringMask: (stickering: ExperimentalStickering) => Promise<StickeringMask>;
    stickerings: () => Promise<string[]>;
    puzzleSpecificSimplifyOptions: PuzzleSpecificSimplifyOptions;
    keyMapping: () => Promise<{
        [key: string]: AlgLeaf;
        [key: number]: AlgLeaf;
    }>;
};

/** @category All Puzzles */
declare const puzzles: Record<string, PuzzleLoader>;

export { PuzzleLoader, cube2x2x2, cube3x3x3, eventInfo, puzzles, twizzleEvents, wcaEventInfo, wcaEvents };
