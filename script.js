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
let caseAtTheTime;
let lineMax;
let newRebound;
let newBoardDisplay;

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
    newRebound = new ballMovementCl();
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
    this.balldescent();
  }
  // On écrit la méthode qui définit de quel côté la balle va rebondir en cas de contact avec la plateforme
  whichMove() {
    console.log("new decision");
    if (caseAtTheTime.line === lineMax) {
      if (caseAtTheTime.column === platePosition[0]) {
        if (caseAtTheTime.column === 1) {
          this.diagUpRight();
        } else {
          this.diagUpLeft();
        }
      } else if (caseAtTheTime.column === platePosition[1]) {
        if (caseAtTheTime.column === caseNumber) {
          this.diagUpLeft();
        } else {
          this.diagUpRight();
        }
      } else console.log("FAIL !!!");
    }
  }

  // On gère la première descente de la balle qui va se faire en ligne droite
  balldescent() {
    lineMax = boardCasesArray[boardCasesArray.length - 1].line;

    const startDescentInterval = function () {
      let descentInterval;
      let newBallLineIndex = 0;
      const blink = function () {
        newBallLineIndex = newBallLineIndex + 1;
        // On enlève la balle de la case qu'elle occupait jusqu'à présent
        boardCasesArray
          .find((cas) => cas.ballPresence === true)
          .toggleBallPresence();
        //  On met la balle dans sa nouvelle case en lui conservant la colonne de départ et en se déplaçant d'une case dans le table des lettres de l'alphabet
        boardCasesArray
          .find(
            (cas) =>
              cas.line === alphabet[newBallLineIndex] &&
              cas.column === ballInitialColumn
          )
          .toggleBallPresence();

        caseAtTheTime = boardCasesArray.find(
          (cas) => cas.ballPresence === true
        );
        // On active la représentation graphique
        newBoardDisplay = new showBoardCl();
        newBoardDisplay.showBoard();
        //  On arrête la descente une fois qu'on est arrivé en bas de la plage de jeu.
        if (
          boardCasesArray.find((cas) => cas.ballPresence === true).line ===
          lineMax
        ) {
          clearInterval(descentInterval);
          newRebound.whichMove();
        }
      };
      descentInterval = setInterval(blink, 500);
    };
    startDescentInterval();
  }

  // Suivent les méthodes qui définissent le comportement de la balle en cas de contact avec le mur
  diagUpLeft() {
    console.log("diagUpLeft");
    const startUpLeftInterval = function () {
      let blinkInterval;
      const blink = function () {
        // On enlève la balle de la la position qu'elle occupe dans le tableau du back JS
        boardCasesArray
          .find((cas) => cas.ballPresence === true)
          .toggleBallPresence();

        // On trouve la nouvelle ligne que va occuper la balle (elle remonte d'une ligne et se décalle d'une colonne vers la gauche)
        const newLine =
          alphabet[
            alphabet.findIndex((letter) => letter === caseAtTheTime.line) - 1
          ];
        const newColumn = caseAtTheTime.column - 1;
        boardCasesArray
          .find((cas) => cas.column === newColumn && cas.line === newLine)
          .toggleBallPresence();

        // On met à jour la variable qui stocke la position de la balle
        caseAtTheTime = boardCasesArray.find(
          (cas) => cas.ballPresence === true
        );

        // On met à jour la représentation visuelle
        newBoardDisplay.showBoard();

        // On crée la condition d'arrêt pour la méthode
        // Attention à la gestion des coins, c'est à la fois une rebond sur la gauche et sur le haut !!!!!
        if (caseAtTheTime.column === 1 && caseAtTheTime.line != "A") {
          clearInterval(blinkInterval);
          newRebound.diagUpRight();
        }
        if (caseAtTheTime.line === "A" && caseAtTheTime.column != 1) {
          clearInterval(blinkInterval);
          newRebound.diagDownLeft();
        }
        if (caseAtTheTime.line === "A" && caseAtTheTime.column === 1) {
          clearInterval(blinkInterval);
          newRebound.diagDownRight();
        }
      };
      blinkInterval = setInterval(blink, 500);
    };
    startUpLeftInterval();
  }

  diagUpRight() {
    console.log("diagUpRight");
    const startUpRightInterval = function () {
      let blinkInterval;
      const blink = function () {
        // On enlève la balle de la la position qu'elle occupe dans le tableau du back JS
        boardCasesArray
          .find((cas) => cas.ballPresence === true)
          .toggleBallPresence();

        // On trouve la nouvelle ligne que va occuper la balle (elle remonte d'une ligne et se décalle d'une colonne vers la gauche)
        const newLine =
          alphabet[
            alphabet.findIndex((letter) => letter === caseAtTheTime.line) - 1
          ];
        const newColumn = caseAtTheTime.column + 1;
        boardCasesArray
          .find((cas) => cas.column === newColumn && cas.line === newLine)
          .toggleBallPresence();

        // On met à jour la variable qui stocke la position de la balle
        caseAtTheTime = boardCasesArray.find(
          (cas) => cas.ballPresence === true
        );

        // On met à jour la représentation visuelle
        newBoardDisplay.showBoard();

        // On crée la condition d'arrêt
        if (caseAtTheTime.column === caseNumber && caseAtTheTime.line != "A") {
          clearInterval(blinkInterval);
          newRebound.diagUpLeft();
        }
        if (caseAtTheTime.line === "A" && caseAtTheTime.column != caseNumber) {
          clearInterval(blinkInterval);
          newRebound.diagDownRight();
        }
        if (caseAtTheTime.line === "A" && caseAtTheTime.column === caseNumber) {
          clearInterval(blinkInterval);
          newRebound.diagDownLeft();
        }
      };
      blinkInterval = setInterval(blink, 500);
    };
    startUpRightInterval();
  }

  diagDownRight() {
    console.log("diagDownRight");
    const startDownRightInterval = function () {
      let blinkInterval;
      const blink = function () {
        // On enlève la balle de la la position qu'elle occupe dans le tableau du back JS
        boardCasesArray
          .find((cas) => cas.ballPresence === true)
          .toggleBallPresence();

        // On trouve la nouvelle ligne que va occuper la balle (elle remonte d'une ligne et se décalle d'une colonne vers la gauche)
        const newLine =
          alphabet[
            alphabet.findIndex((letter) => letter === caseAtTheTime.line) + 1
          ];
        const newColumn = caseAtTheTime.column + 1;
        boardCasesArray
          .find((cas) => cas.column === newColumn && cas.line === newLine)
          .toggleBallPresence();

        // On met à jour la variable qui stocke la position de la balle
        caseAtTheTime = boardCasesArray.find(
          (cas) => cas.ballPresence === true
        );

        // On met à jour la représentation visuelle
        newBoardDisplay.showBoard();

        // On crée la condition d'arrêt pour la méthode
        // Attention à la gestion des coins, c'est à la fois une rebon sur la gauche et sur le haut !!!!!
        if (
          caseAtTheTime.column === caseNumber &&
          caseAtTheTime.line != lineMax
        ) {
          clearInterval(blinkInterval);
          newRebound.diagDownLeft();
        }
        if (caseAtTheTime.line === lineMax) {
          clearInterval(blinkInterval);
          newRebound.whichMove();
        }
      };
      blinkInterval = setInterval(blink, 500);
    };
    startDownRightInterval();
  }

  diagDownLeft() {
    console.log("diagDownLeft");
    const startDownLeftInterval = function () {
      let blinkInterval;
      const blink = function () {
        // On enlève la balle de la la position qu'elle occupe dans le tableau du back JS
        boardCasesArray
          .find((cas) => cas.ballPresence === true)
          .toggleBallPresence();

        // On trouve la nouvelle ligne que va occuper la balle (elle remonte d'une ligne et se décalle d'une colonne vers la gauche)
        const newLine =
          alphabet[
            alphabet.findIndex((letter) => letter === caseAtTheTime.line) + 1
          ];
        const newColumn = caseAtTheTime.column - 1;
        boardCasesArray
          .find((cas) => cas.column === newColumn && cas.line === newLine)
          .toggleBallPresence();

        // On met à jour la variable qui stocke la position de la balle
        caseAtTheTime = boardCasesArray.find(
          (cas) => cas.ballPresence === true
        );

        // On met à jour la représentation visuelle
        newBoardDisplay.showBoard();

        // On crée la condition d'arrêt pour la méthode
        // Attention à la gestion des coins, c'est à la fois une rebond sur la gauche et sur le haut !!!!!
        // Si on est sur la ligne la plus en bas, la situation est
        if (caseAtTheTime.column === 1 && caseAtTheTime.line != lineMax) {
          clearInterval(blinkInterval);
          newRebound.diagDownRight();
        }
        if (caseAtTheTime.line === lineMax) {
          clearInterval(blinkInterval);
          newRebound.whichMove();
        }
      };
      blinkInterval = setInterval(blink, 500);
    };
    startDownLeftInterval();
  }
}

class playGameCl {
  constructor() {
    this.moveplate();
  }

  moveplate() {
    document.addEventListener("keydown", function (event) {
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
