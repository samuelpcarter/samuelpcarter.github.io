import { TwistyPlayer } from './cubing/twisty/index.js';
import { Alg } from './cubing/alg/index.js';
import { initialize, random444Scramble } from './cubing/chunks/search-dynamic-solve-4x4x4-6MKLH6KJ.js';

const player = document.getElementById('player');
await initialize();
let scrambleAlg = null;

document.getElementById('scramble').onclick = async () => {
  scrambleAlg = await random444Scramble();
  player.alg = scrambleAlg.toString();
};

document.getElementById('solve').onclick = () => {
  if (!scrambleAlg) return;
  const solution = scrambleAlg.invert();
  player.alg = scrambleAlg.toString() + ' ' + solution.toString();
  scrambleAlg = null;
};
