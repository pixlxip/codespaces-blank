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

let highlighting = {
  a: undefined,
  b: undefined,
};

const isW = (p) => {
  return [WP, WR, WN, WB, WQ, WK].includes(p);
}

const isB = (p) => {
  return [BP, BR, BN, BB, BQ, BK].includes(p);
}

const moved = (p, t) => {
  const hypotheticalBoard = board.slice();
  hypotheticalBoard[t[0]][t[1]] = hypotheticalBoard[p[0]][p[1]];
  hypotheticalBoard[p[0]][p[1]] = NP;
  return hypotheticalBoard;
}

const knightRelativePositions = [
  [1, 2],
  [1, -2],
  [-1, 2],
  [-1, -2],
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1]
];

const rookRelativePositions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

const bishopRelativePositions = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1]
];

const queenRelativePositions = [...rookRelativePositions, ...bishopRelativePositions];

const kingRelativePositions = [
  [1, 0],
  [1, 1],
  [1, -1],
  [0, 1],
  [0, -1],
  [-1, 0],
  [-1, 1],
  [-1, -1]
];

const pawnMoves = (a, b, list, compare, hypotheticalBoard, player) => {
  if (player ? (
    a == 6 &&
    hypotheticalBoard[a - 1][b] == NP &&
    hypotheticalBoard[a - 2][b] == NP
  ) : (
    a == 1 &&
    hypotheticalBoard[a + 1][b] == NP &&
    hypotheticalBoard[a + 2][b] == NP
  )) {
    list.push(player ? [a - 1, b] : [a + 1, b]);
    list.push(player ? [a - 2, b] : [a + 2, b]);
  } else if (player ? (hypotheticalBoard[a - 1][b] == NP) : (hypotheticalBoard[a + 1][b] == NP))
    list.push(player ? [a - 1, b] : [a + 1, b]);
  if (compare.includes(player ? hypotheticalBoard[a - 1][b - 1] : hypotheticalBoard[a + 1][b - 1]))
    list.push(player ? [a - 1, b - 1] : [a + 1, b - 1]);
  if (compare.includes(player ? hypotheticalBoard[a - 1][b + 1] : hypotheticalBoard[a + 1][b + 1]))
    list.push(player ? [a - 1, b + 1] : [a + 1, b + 1]);
}

const knMoves = (a, b, list, compare, hypotheticalBoard, pos) => {
  log(compare);
  for (let i = 0; i < pos.length; i++) {
    if (
      a + pos[i][0] >= hypotheticalBoard.length ||
      a + pos[i][0] < 0 ||
      b + pos[i][1] >= hypotheticalBoard[0].length ||
      b + pos[i][1] < 0) continue;
    if (compare.includes(hypotheticalBoard[a + pos[i][0]][b + pos[i][1]])) {
      list.push([a + pos[i][0], b + pos[i][1]]);
    }
  }
}

const rbqMoves = (a, b, list, compare, hypotheticalBoard, pos) => {
  for (let i = 0; i < pos.length; i++) {
    for (let j = 1; (
      a + (j * pos[i][0]) >= 0 && 
      a + (j * pos[i][0]) < hypotheticalBoard.length && 
      b + (j * pos[i][1]) >= 0 && 
      b + (j * pos[i][1]) < hypotheticalBoard[0].length
    ); j++) {
      if (hypotheticalBoard[a + (j * pos[i][0])][b + (j * pos[i][1])] == NP) {
        list.push([a + (j * pos[i][0]), b + (j * pos[i][1])]);
      } else if (compare.includes(hypotheticalBoard[a + (j * pos[i][0])][b + (j * pos[i][1])])) {
        log(hypotheticalBoard[a + (j * pos[i][0])][b + (j * pos[i][1])]);
        list.push([a + (j * pos[i][0]), b + (j * pos[i][1])]);
        break;
      } else break;
    }
  }
};

const c4c = (p, hypotheticalBoard) => {
  
  return false;
}

const writePiece = (a, b, piece) => {
  board[a][b] = piece;
  document.querySelectorAll(`.cr${a}.cc${b}`)[0].innerText = piece;
}

const possibleMoves = (a, b) => {
  const targetPiece = board[a][b];
  if (targetPiece == NP) return [];
  const moves = [];
  
  switch (targetPiece) {
    case WP:
      pawnMoves(a, b, moves, blacks, board, true);
      break;
    case WR:
      rbqMoves(a, b, moves, blacks, board, rookRelativePositions);
      break;
    case WN:
      knMoves(a, b, moves, [...blacks, NP], board, knightRelativePositions);
      break;
    case WB:
      rbqMoves(a, b, moves, blacks, board, bishopRelativePositions);
      break;
    case WQ:
      rbqMoves(a, b, moves, blacks, board, queenRelativePositions);
      break;
    case WK:
      knMoves(a, b, moves, [...blacks, NP], board, kingRelativePositions);
      break;
    case BP:
      pawnMoves(a, b, moves, whites, board, false);
      break;
    case BR:
      rbqMoves(a, b, moves, whites, board, rookRelativePositions);
      break;
    case BN:
      knMoves(a, b, moves, [...whites, NP], board, knightRelativePositions);
      break;
    case BB:
      rbqMoves(a, b, moves, whites, board, bishopRelativePositions);
      break;
    case BQ:
      rbqMoves(a, b, moves, whites, board, queenRelativePositions);
      break;
    case BK:
      knMoves(a, b, moves, [...whites, NP], board, kingRelativePositions);
      break;
  }
  //moves.filter((move) => c4c(whites.includes(targetPiece), moved([a, b], move)));
  return moves;
};

const highlightCells = (cells) => {
  for (let i = 0; i < cells.length; i++) 
    document.querySelectorAll(`.cr${cells[i][0]}.cc${cells[i][1]}`)[0].classList.add(`highlighted`);
}

const clearHighlightedCells = () => {
  while (document.querySelectorAll(`.highlighted`).length)
    document.querySelectorAll(`.highlighted`)[0].classList.remove(`highlighted`);
}

const cellClick = (event) => {
  const a = +(event.target.a);
  const b = +(event.target.b);
  clearHighlightedCells();
  if ((highlighting.a != a || highlighting.b != b) && board[a][b] != NP) {
    highlightCells([...possibleMoves(a, b), [a, b]]);
    highlighting.a = a;
    highlighting.b = b;
  } else {
    highlighting.a = undefined;
    highlighting.b = undefined;
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