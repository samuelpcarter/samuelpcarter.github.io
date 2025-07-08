const colors = {
  U: 'white',
  D: 'yellow',
  F: 'green',
  B: 'blue',
  L: 'orange',
  R: 'red'
};

const cube = {
  U: Array(9).fill(colors.U),
  D: Array(9).fill(colors.D),
  F: Array(9).fill(colors.F),
  B: Array(9).fill(colors.B),
  L: Array(9).fill(colors.L),
  R: Array(9).fill(colors.R)
};

function rotateFaceCW(face) {
  const [a,b,c,d,e,f,g,h,i] = cube[face];
  cube[face][0] = g;
  cube[face][1] = d;
  cube[face][2] = a;
  cube[face][3] = h;
  cube[face][4] = e;
  cube[face][5] = b;
  cube[face][6] = i;
  cube[face][7] = f;
  cube[face][8] = c;
}

function rotateU() {
  rotateFaceCW('U');
  const tmp = cube.F.slice(0,3);
  cube.F[0] = cube.R[0]; cube.F[1] = cube.R[1]; cube.F[2] = cube.R[2];
  cube.R[0] = cube.B[0]; cube.R[1] = cube.B[1]; cube.R[2] = cube.B[2];
  cube.B[0] = cube.L[0]; cube.B[1] = cube.L[1]; cube.B[2] = cube.L[2];
  cube.L[0] = tmp[0]; cube.L[1] = tmp[1]; cube.L[2] = tmp[2];
}

function rotateD() {
  rotateFaceCW('D');
  const tmp = cube.F.slice(6,9);
  cube.F[6] = cube.L[6]; cube.F[7] = cube.L[7]; cube.F[8] = cube.L[8];
  cube.L[6] = cube.B[6]; cube.L[7] = cube.B[7]; cube.L[8] = cube.B[8];
  cube.B[6] = cube.R[6]; cube.B[7] = cube.R[7]; cube.B[8] = cube.R[8];
  cube.R[6] = tmp[0]; cube.R[7] = tmp[1]; cube.R[8] = tmp[2];
}

function rotateF() {
  rotateFaceCW('F');
  const t0 = cube.U[6], t1 = cube.U[7], t2 = cube.U[8];
  cube.U[6] = cube.L[8]; cube.U[7] = cube.L[5]; cube.U[8] = cube.L[2];
  cube.L[8] = cube.D[2]; cube.L[5] = cube.D[1]; cube.L[2] = cube.D[0];
  cube.D[2] = cube.R[0]; cube.D[1] = cube.R[3]; cube.D[0] = cube.R[6];
  cube.R[0] = t0; cube.R[3] = t1; cube.R[6] = t2;
}

function rotateB() {
  rotateFaceCW('B');
  const t0 = cube.U[0], t1 = cube.U[1], t2 = cube.U[2];
  cube.U[0] = cube.R[2]; cube.U[1] = cube.R[5]; cube.U[2] = cube.R[8];
  cube.R[2] = cube.D[8]; cube.R[5] = cube.D[7]; cube.R[8] = cube.D[6];
  cube.D[8] = cube.L[6]; cube.D[7] = cube.L[3]; cube.D[6] = cube.L[0];
  cube.L[6] = t0; cube.L[3] = t1; cube.L[0] = t2;
}

function rotateL() {
  rotateFaceCW('L');
  const t0 = cube.U[0], t1 = cube.U[3], t2 = cube.U[6];
  cube.U[0] = cube.F[0]; cube.U[3] = cube.F[3]; cube.U[6] = cube.F[6];
  cube.F[0] = cube.D[0]; cube.F[3] = cube.D[3]; cube.F[6] = cube.D[6];
  cube.D[0] = cube.B[8]; cube.D[3] = cube.B[5]; cube.D[6] = cube.B[2];
  cube.B[8] = t0; cube.B[5] = t1; cube.B[2] = t2;
}

function rotateR() {
  rotateFaceCW('R');
  const t0 = cube.U[2], t1 = cube.U[5], t2 = cube.U[8];
  cube.U[2] = cube.B[6]; cube.U[5] = cube.B[3]; cube.U[8] = cube.B[0];
  cube.B[6] = cube.D[8]; cube.B[3] = cube.D[5]; cube.B[0] = cube.D[2];
  cube.D[8] = cube.F[8]; cube.D[5] = cube.F[5]; cube.D[2] = cube.F[2];
  cube.F[8] = t0; cube.F[5] = t1; cube.F[2] = t2;
}

function updateDisplay() {
  for (const face of ['U','D','F','B','L','R']) {
    for (let i=0;i<9;i++) {
      document.querySelector(`#${face} .t${i}`).style.background = cube[face][i];
    }
  }
}

function scramble() {
  const moves = [rotateU, rotateD, rotateF, rotateB, rotateL, rotateR];
  for (let i=0;i<20;i++) moves[Math.floor(Math.random()*moves.length)]();
  updateDisplay();
}

function resetCube() {
  cube.U.fill(colors.U);
  cube.D.fill(colors.D);
  cube.F.fill(colors.F);
  cube.B.fill(colors.B);
  cube.L.fill(colors.L);
  cube.R.fill(colors.R);
  updateDisplay();
}

function setup() {
  const container = document.getElementById('cube');
  ['U','L','F','R','B','D'].forEach(face => {
    const f = document.createElement('div');
    f.id = face;
    f.className = 'face';
    for(let i=0;i<9;i++) {
      const sq = document.createElement('div');
      sq.className = `tile t${i}`;
      f.appendChild(sq);
    }
    container.appendChild(f);
  });
  updateDisplay();
}

document.addEventListener('DOMContentLoaded', setup);
document.addEventListener('keydown', e => {
  switch(e.key.toUpperCase()) {
    case 'U': rotateU(); break;
    case 'D': rotateD(); break;
    case 'F': rotateF(); break;
    case 'B': rotateB(); break;
    case 'L': rotateL(); break;
    case 'R': rotateR(); break;
    default: return;
  }
  updateDisplay();
});
