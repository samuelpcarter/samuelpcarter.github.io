import { y as AlgIndexer, v as KPuzzle, s as Alg, M as Move, T as Timestamp, K as KPattern, z as KTransformation, D as Duration, w as StickeringMask } from '../PuzzleLoader-DWqO9l1G.js';
export { H as BackViewLayout, N as EXPERIMENTAL_PROP_NO_VALUE, L as ExperimentalMillisecondTimestamp, E as ExperimentalStickering, u as PuzzleID, F as TwistyAlgEditor, C as TwistyAlgViewer, B as TwistyPlayer, G as TwistyPlayerConfig, J as TwizzleLink, V as VisualizationFormat, I as backViewLayouts } from '../PuzzleLoader-DWqO9l1G.js';
import 'three/src/Three.js';

declare const twistyDebugGlobals: {
    shareAllNewRenderers: "auto" | "always" | "never";
    showRenderStats: boolean;
};
declare function setTwistyDebug(options: Partial<typeof twistyDebugGlobals>): void;

declare class SimpleAlgIndexer implements AlgIndexer {
    private kpuzzle;
    private moves;
    private durationFn;
    constructor(kpuzzle: KPuzzle, alg: Alg);
    getAnimLeaf(index: number): Move;
    indexToMoveStartTimestamp(index: number): Timestamp;
    timestampToIndex(timestamp: Timestamp): number;
    patternAtIndex(index: number): KPattern;
    transformationAtIndex(index: number): KTransformation;
    algDuration(): Duration;
    numAnimatedLeaves(): number;
    moveDuration(index: number): number;
}

declare class TreeAlgIndexer implements AlgIndexer {
    private kpuzzle;
    private decoration;
    private walker;
    constructor(kpuzzle: KPuzzle, alg: Alg);
    getAnimLeaf(index: number): Move | null;
    indexToMoveStartTimestamp(index: number): Timestamp;
    indexToMovesInProgress(index: number): Timestamp;
    patternAtIndex(index: number, startPattern?: KPattern): KPattern;
    transformationAtIndex(index: number): KTransformation;
    numAnimatedLeaves(): number;
    timestampToIndex(timestamp: Timestamp): number;
    algDuration(): Duration;
    moveDuration(index: number): number;
}

declare class TwistyAnimatedSVG {
    kpuzzle: KPuzzle;
    private showUnknownOrientations;
    wrapperElement: HTMLElement;
    svgElement: SVGElement;
    gradientDefs: SVGDefsElement;
    private originalColors;
    private gradients;
    private svgID;
    constructor(kpuzzle: KPuzzle, svgSource: string, experimentalStickeringMask?: StickeringMask, showUnknownOrientations?: boolean);
    drawPattern(pattern: KPattern, nextPattern?: KPattern, fraction?: number): void;
    draw(pattern: KPattern, nextPattern?: KPattern, fraction?: number): void;
    private newGradient;
    private elementID;
    private elementByID;
}

export { AlgIndexer, TwistyAnimatedSVG as ExperimentalSVGAnimator, SimpleAlgIndexer, TreeAlgIndexer, setTwistyDebug };
