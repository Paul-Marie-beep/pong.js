"use strict";

const base = document.querySelector(".base");
const board = document.querySelector(".board");

const baseCasesArray = [];
const platePosition = [];
const boardCasesArray = [];
const caseNumber = 12;
const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
let ballInitialColumn;
let descentInterval;
let caseAtTheTime;

class baseCaseCl {
  constructor(position) {
    this.position = position;
    this.platePresence = false;
  }
}

class boardCaseCl {
  constructor(line, column) {
    this.line = line;
    this.column = column;
    this.ballPresence = false;
  }

  toggleBallPresence() {
    this.ballPresence
      ? (this.ballPresence = false)
      : (this.ballPresence = true);
  }
}

class createBaseCl {
  constructor() {
    this.casenumber = caseNumber;

    this.createJsBaseCases();
    this.setBase();
  }

  createJsBaseCases() {
    for (let i = 1; i < this.casenumber + 1; i++) {
      baseCasesArray.push(new baseCaseCl(i));
    }
  }

  setBase() {
    platePosition.unshift(this.casenumber / 2);
    platePosition.push(this.casenumber / 2 + 1);
  }
}

class createBoardCl {
  constructor() {
    this.height = 8;
    this.numberOfBoardCases = caseNumber * this.height;

    this.createJsBoardCases();
    this.setBall();
    this.balldescent();
  }

  createJsBoardCases() {
    for (let i = 1; i <= this.height; i++) {
      let letter = alphabet[i - 1];
      for (let j = 1; j <= caseNumber; j++) {
        boardCasesArray.push(new boardCaseCl(letter, j));
      }
    }
  }

  setBall() {
    const randomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min) + 1) + min;
    };
    // On assigne une colonne de départ au hasard pour la balle, attendu qu'elle part forcément de la première colonne.
    ballInitialColumn = randomInt(1, caseNumber);
    boardCasesArray.find(
      (cas) => cas.column === ballInitialColumn
    ).ballPresence = true;
  }

  // On gère la première descente de la balle qui va se faire en ligne droite
  balldescent() {
    const lineMax = boardCasesArray[boardCasesArray.length - 1].line;

    const startDescentInterval = function () {
      let newBallLineIndex = 0;
      const descent = function () {
        newBallLineIndex = newBallLineIndex + 1;
        // On enlève la balle de la case qu'elle occupait jusqu'à présent
        boardCasesArray.find(
          (cas) => cas.ballPresence === true
        ).ballPresence = false;
        //  On met la balle dans sa nouvelle case en lui conservant la colonne de départ et en se déplaçant d'une case dans le table des lettres de l'alphabet
        boardCasesArray.find(
          (cas) =>
            cas.line === alphabet[newBallLineIndex] &&
            cas.column === ballInitialColumn
        ).ballPresence = true;

        caseAtTheTime = boardCasesArray.find(
          (cas) => cas.ballPresence === true
        );
        const newBoardDisplay = new showBoardCl();
        //  On arrête la descente une fois qu'on est arrivé en bas de la plage de jeu.
        if (
          boardCasesArray.find((cas) => cas.ballPresence === true).line ===
          lineMax
        )
          clearInterval(descentInterval);
      };
      descentInterval = setInterval(descent, 1000);
    };
    startDescentInterval();
  }
}

class showBaseCl {
  constructor() {
    this.showBase();
    this.showPlate();
  }
  showBase() {
    base.innerHTML = "";
    for (let i = 1; i < baseCasesArray.length + 1; i++) {
      let html;
      html = `<div class="base--case base--case-${i}"><div class="plate plate-${i} hidden"></div></div>`;
      base.insertAdjacentHTML("beforeend", html);
    }
  }

  showPlate() {
    platePosition.forEach(function (pos) {
      document.querySelector(`.plate-${pos}`).classList.remove("hidden");
    });
  }
}

class showInitialBoardCl {
  constructor() {
    this.showInitialBoard();
  }

  showInitialBoard() {
    board.innerHTML = "";
    boardCasesArray.forEach(function (cas) {
      if (cas.ballPresence) {
        let html = `<div class="case line-${cas.line} column-${cas.column}"><div class="ball"></div></div>`;
        board.insertAdjacentHTML("beforeend", html);
      } else {
        let html = `<div class="case line-${cas.line} column-${cas.column}"></div></div>`;
        board.insertAdjacentHTML("beforeend", html);
      }
    });
  }
}

class showBoardCl {
  constructor() {
    this.showBoard();
  }

  showBoard() {
    // On vide la  (ie la div) contenant la balle au préalable. On la vide en remontant à l'élement parent de la la balle et en supprimant le html de la div
    document.querySelector(".ball").parentElement.innerHTML = "";

    // On sélection la case où l'on doit mettre la balle et on la rajoute. On soustrait 1 car on la sélectionne par l'index d'une nodeliste, index qui commence donc à 0.
    document.querySelectorAll(`.line-${caseAtTheTime.line}`)[
      caseAtTheTime.column - 1
    ].innerHTML = '<div class="ball"></div>';
  }
}

class ballMovementCl {
  constructor() {
    this.WhichMove();
  }
}

class playGameCl {
  constructor() {
    this.moveplate();
  }

  moveplate() {
    document.addEventListener("keydown", function (event) {
      console.log(event.key);
      if (event.key === "ArrowLeft") {
        if (platePosition[0] === 1) return;
        platePosition.forEach(function (pos, i) {
          platePosition[i] = pos - 1;
        });
        const newDisplay = new showBaseCl();
      }
      if (event.key === "ArrowRight") {
        if (platePosition[1] === baseCasesArray.length) return;
        platePosition.forEach(function (pos, i) {
          platePosition[i] = pos + 1;
        });
        const newDisplay = new showBaseCl();
      }
    });
  }
}

class newGameCl {
  constructor() {
    this.initGame();
    this.newShow();
    this.gameLauncher();
  }

  initGame() {
    const newBase = new createBaseCl();
    const newBoard = new createBoardCl();
  }

  newShow() {
    const newBaseDisplay = new showBaseCl();
    const newBoardDisplay = new showInitialBoardCl();
  }

  gameLauncher() {
    const gameLaunched = new playGameCl();
  }
}

const newGame = new newGameCl();
