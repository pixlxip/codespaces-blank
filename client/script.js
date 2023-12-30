const DEBUG = true;
const ERUDA = false;
const DIV = false;
if (ERUDA) eruda.init();
const log = DEBUG ? DIV ? (a) => { document.getElementById(`log`).innerText += `\n` + a; } : console.log : () => {};

const table = document.getElementById(`table`);
const side = `white`
const [WP, WR, WN, WB, WQ, WK, BP, BR, BN, BB, BQ, BK, NP, WKP, BKP] = [`♙`, `♖`, `♘`, `♗`, `♕`, `♔`, `♟︎`, `♜`, `♞`, `♝`, `♛`, `♚`, ` `, [7, 4], [0, 4]];

const board = [
  [BR, BN, BB, BQ, BK, BB, BN, BR],
  [BP, BP, BP, BP, BP, BP, BP, BP],
  [NP, NP, NP, NP, NP, NP, NP, NP],
  [NP, NP, NP, NP, NP, NP, NP, NP],
  [NP, NP, NP, NP, NP, NP, NP, NP],
  [NP, NP, NP, NP, NP, NP, NP, NP],
  [WP, WP, WP, WP, WP, WP, WP, WP],
  [WR, WN, WB, WQ, WK, WB, WN, WR]
];

const whites = [WP, WR, WN, WB, WQ, WK];
const blacks = [BP, BR, BN, BB, BQ, BK];
const diagW = [WB, WQ];
const horiW = [WR, WQ];
const diagB = [BB, BQ];
const horiB = [BR, BQ];

const isW = (p) => {
  return [WP, WR, WN, WB, WQ, WK].includes(p);
}

const isB = (p) => {
  return [BP, BR, BN, BB, BQ, BK].includes(p);
}

const moved = (p, t) => {
  const hb = board.slice();
  hb[t[0]][t[1]] = hb[p[0]][p[1]];
  hb[p[0]][p[1]] = NP;
  return hb;
}

const knightPos = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1]
];

const rookPos = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

const bishopPos = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
];

const queenPos = [...rookPos, ...bishopPos];

const kingPos = [
  [1, 0],
  [1, 1],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1]
];

const pawnMoves = (a, b, list, compare, hb, p) => {
  if (p ? (
    a == 6 &&
    hb[a - 1][b] == NP &&
    hb[a - 2][b] == NP
  ) : (
    a == 1 &&
    hb[a + 1][b] == NP &&
    hb[a + 2][b] == NP
  )) {
    list.push(p ? [a - 1, b] : [a + 1, b]);
    list.push(p ? [a - 2, b] : [a + 2, b]);
  } else if (p ? (hb[a - 1][b] == NP) : (hb[a + 1][b] == NP))
    list.push(p ? [a - 1, b] : [a + 1, b]);
  if (compare.includes(p ? hb[a - 1][b - 1] : hb[a + 1][b - 1]))
    list.push(p ? [a - 1, b - 1] : [a + 1, b - 1]);
  if (compare.includes(p ? hb[a - 1][b + 1] : hb[a + 1][b + 1]))
    list.push(p ? [a - 1, b + 1] : [a + 1, b + 1]);
}

const knMoves = (a, b, list, compare, hb, pos) => {
  log(compare);
  for (let i = 0; i < pos.length; i++) {
    if (
        a + pos[i][0] >= hb.length ||
        a + pos[i][0] < 0 ||
        b + pos[i][1] >= hb[0].length ||
        b + pos[i][1] < 0) continue;
    if (compare.includes(hb[a + pos[i][0]][b + pos[i][1]])) {
      list.push([a + pos[i][0], b + pos[i][1]]);
    }
  }
}

const rbqMoves = (a, b, list, compare, hb, pos) => {
  for (let i = 0; i < pos.length; i++) {
    for (let j = 1; (
      a + (j * pos[i][0]) >= 0 && 
      a + (j * pos[i][0]) < hb.length && 
      b + (j * pos[i][1]) >= 0 && 
      b + (j * pos[i][1]) < hb[0].length
    ); j++) {
      if (hb[a + (j * pos[i][0])][b + (j * pos[i][1])] == NP) {
        list.push([a + (j * pos[i][0]), b + (j * pos[i][1])]);
      } else if (compare.includes(hb[a + (j * pos[i][0])][b + (j * pos[i][1])])) {
        log(hb[a + (j * pos[i][0])][b + (j * pos[i][1])]);
        list.push([a + (j * pos[i][0]), b + (j * pos[i][1])]);
        break;
      } else break;
    }
  }
};

const c4c = (p, hb) => {
  
  return false;
}

const writePiece = (a, b, p) => {
  board[a][b] = p;
  document.querySelectorAll(`.cr${a}.cc${b}`)[0].innerText = p;
}

const possibleMoves = (a, b) => {
  const tp = board[a][b];
  if (tp == NP) return [];
  const moves = [];
  
  switch (tp) {
    case WP:
      pawnMoves(a, b, moves, blacks, board, true);
      break;
    case WR:
      rbqMoves(a, b, moves, blacks, board, rookPos);
      break;
    case WN:
      knMoves(a, b, moves, [...blacks, NP], board, knightPos);
      break;
    case WB:
      rbqMoves(a, b, moves, blacks, board, bishopPos);
      break;
    case WQ:
      rbqMoves(a, b, moves, blacks, board, queenPos);
      break;
    case WK:
      knMoves(a, b, moves, [...blacks, NP], board, kingPos);
      break;
    case BP:
      pawnMoves(a, b, moves, whites, board, false);
      break;
    case BR:
      rbqMoves(a, b, moves, whites, board, rookPos);
      break;
    case BN:
      knMoves(a, b, moves, [...whites, NP], board, knightPos)
      break;
    case BB:
      rbqMoves(a, b, moves, whites, board, bishopPos);
      break;
    case BQ:
      rbqMoves(a, b, moves, whites, board, queenPos);
      break;
    case BK:
      knMoves(a, b, moves, [...whites, NP], board, kingPos);
      break;
  }
  //moves.filter((move) => c4c(whites.includes(tp), moved([a, b], move)));
  return moves;
};

const cellClick = (e) => {
  const a = +(e.target.a);
  const b = +(e.target.b);
  const test = possibleMoves(a, b);

  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      document.querySelectorAll(`.cr${i}.cc${j}`)[0].style = `background-color: #00000000;`;
    }
  }

  for (let i = 0; i < test.length; i++) {
    document.querySelectorAll(`.cr${test[i][0]}.cc${test[i][1]}`)[0].style = `background-color: yellow;`;
  }
};

for ( let i = (side == `white` ? 0 : 7); ((side == `white`) ? (i < 8) : (i > -1)); i += (side == `white` ? 1 : -1) ) {
  let row = document.createElement(`tr`);
  row.classList.add(`r${i.toString()}`);
  for ( let j = (side == `white` ? 0 : 7); ((side == `white`) ? (j < 8) : (j > -1)); j += (side == `white` ? 1 : -1) ) {
    let cell = document.createElement(`td`);
    let celldiv = document.createElement(`div`);
    cell.classList.add(Math.abs(i - j) % 2 ? `btile` : `wtile`);
    cell.classList.add(`cell`);
    celldiv.classList.add(`cr${i.toString()}`);
    celldiv.classList.add(`cc${j.toString()}`);
    celldiv.classList.add(`celldiv`);
    celldiv.innerText = board[i][j];
    celldiv.addEventListener(`click`, cellClick);
    celldiv.a = i.toString();
    celldiv.b = j.toString();
    cell.appendChild(celldiv);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

writePiece(3, 4, BR);
writePiece(3, 3, WK);

//cellClick(3, 4);

document.querySelector(`#title`).addEventListener(`click`, () => {
  fetch("/post", {
    method: "POST",
    body: JSON.stringify( { message: `fire` } ),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  })
  .then(res => res.json())
  .then((res) => {
    log(res.message);
  });
  log(`fire`);
});