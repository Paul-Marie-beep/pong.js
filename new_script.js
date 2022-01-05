"use strict";

// Constantes ficées pour dév (le nombre de colonnes doit être pair)
const fixedForNowColumnNumber = 12;
const fixedForNowlineNumber = 8;
/////////////////////////////////////////////////////////////////////////////////////////////////

class baseCaseCl {
  constructor(column) {
    this.column = column;
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

// Application Architecture
////////////////////////////////////////////////////////////////////////////////////////////////

const base = document.querySelector(".base");
const board = document.querySelector(".board");

class GameCl {
  platePosition = [];
  alphabet = [
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
  boardCasesArray = [];
  baseCasesArray = [];
  lineMax;
  // On initialise newLine à 0 parce que c'est sa position initiale pour la première descente
  newLine = "A";
  newColumn;
  caseAtTheTime;
  stopCondition;
  descentInterval;
  moveType;

  constructor(lineNumber, columnNumber) {
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;

    this.createJsBaseCases();
    this.setBase();
    this.createJsBoardCases();
    this.setBall();
    this.buildBase();
    this.moveplate();
    this.showPlateMoving();
    this.buildBoard();
    this.calcLineMax();
    this.ballInitialDescent();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // On commence  par créer le backend du jeu

  // On crée la base dans laquelle la palette va se mouvoir
  createJsBaseCases() {
    for (let i = 1; i < this.columnNumber + 1; i++) {
      this.baseCasesArray.push(new baseCaseCl(i));
    }
  }

  // On place d'office la palette au centre pour le début du jeu
  setBase() {
    this.platePosition.unshift(this.columnNumber / 2);
    this.platePosition.push(this.columnNumber / 2 + 1);
  }

  // On crée les cases dans lauquelle la balle va se mouvoir
  createJsBoardCases() {
    for (let i = 1; i <= this.lineNumber; i++) {
      for (let j = 1; j <= this.columnNumber; j++) {
        this.boardCasesArray.push(new boardCaseCl(this.alphabet[i - 1], j));
      }
    }
  }

  // On place la balle dans une position de départ choisie au hasard
  setBall() {
    const randomInt = (min, max) => {
      return Math.floor(Math.random() * (max - min) + 1) + min;
    };
    // On assigne une colonne de départ au hasard pour la balle, attendu qu'elle part forcément de la première colonne.
    const ballInitialColumn = randomInt(1, this.columnNumber);

    // On met la balle dans la position de départ.
    this.boardCasesArray.find(
      (cas) => cas.column === ballInitialColumn
    ).ballPresence = true;
    // On met à jour la variable qui stocke la position de la balle
    this.caseAtTheTime = this.boardCasesArray.find(
      (cas) => cas.ballPresence === true
    );
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // On crée le front end

  // On va construire la base dans laquelle la palette va bouger``
  buildBase() {
    base.innerHTML = "";
    for (let i = 1; i < this.baseCasesArray.length + 1; i++) {
      const html = `<div class="base--case base--case-${i}"><div class="plate plate-${i} hidden"></div></div>`;
      base.insertAdjacentHTML("beforeend", html);
    }
  }

  // On cache toutes cases de la base ou peu se  du jeu puis on découvre celle où se situe effectivement la palette
  showPlateMoving() {
    document
      .querySelectorAll(".plate")
      .forEach((div) => div.classList.add("hidden"));
    this.showPlate();
  }

  // On montre les mouvements de la palette: On enlève la classe hidden aux cases dans laquelle se trouve désormais la palette
  showPlate() {
    this.platePosition.forEach(function (pos) {
      document.querySelector(`.plate-${pos}`).classList.remove("hidden");
    });
  }

  // On construit les cases où va évoluer la balle
  buildBoard() {
    board.innerHTML = "";
    this.boardCasesArray.forEach(function (cas) {
      if (cas.ballPresence) {
        const html = `<div class="case line-${cas.line} column-${cas.column}"><div class="ball"></div></div>`;
        board.insertAdjacentHTML("beforeend", html);
      } else {
        const html = `<div class="case line-${cas.line} column-${cas.column}"></div></div>`;
        board.insertAdjacentHTML("beforeend", html);
      }
    });
  }

  // On met à jour la représentation graphique en fonction des mouvements de la balle
  showBoard() {
    // On vide la  (ie la div) contenant la balle au préalable. On la vide en remontant à l'élement parent de la la balle et en supprimant le html de la div
    document.querySelector(".ball").parentElement.innerHTML = "";

    // On sélection la case où l'on doit mettre la balle et on la rajoute. On soustrait 1 car on la sélectionne par l'index d'une nodeliste, index qui commence donc à 0.
    document.querySelectorAll(`.line-${this.caseAtTheTime.line}`)[
      this.caseAtTheTime.column - 1
    ].innerHTML = '<div class="ball"></div>';
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // On fait bouger la plateforme
  moveplate() {
    document.addEventListener("keydown", this.listenerMethod.bind(this));
  }

  // On utilise une méthode séparée pour la fonction de l'event listener pour pouvoir lui faire passer un paramètre tout en bindant this à la classe game
  listenerMethod(event) {
    if (event.key === "ArrowLeft") {
      if (this.platePosition[0] === 1) return;
      this.platePosition.forEach((pos, i) => (this.platePosition[i] = pos - 1));
      console.log(this.platePosition);
      this.showPlateMoving();
    }
    if (event.key === "ArrowRight") {
      if (this.platePosition[1] === this.baseCasesArray.length) return;
      this.platePosition.forEach((pos, i) => (this.platePosition[i] = pos + 1));
      this.showPlateMoving();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////// On fait bouger la balle

  // On commence par gérer la première descente de la balle quand elle est lâchée du haut de la boîte

  // On calcule la ligne maximale que peut atteindre la balle.
  calcLineMax() {
    this.lineMax = this.boardCasesArray[this.boardCasesArray.length - 1].line;
  }

  // On programme la fonction qui définit quel mouvement va effectuer
  Blink() {
    // On enlève la balle de la case qu'elle occupait jusqu'à présent
    this.boardCasesArray
      .find((cas) => cas.ballPresence === true)
      .toggleBallPresence();

    // On choisit l'itérateur qui va nous donner la nouvelle position de la balle
    this.choseMoveIterator();
    //  On met la balle dans sa nouvelle case
    this.boardCasesArray
      .find((cas) => cas.column === this.newColumn && cas.line === this.newLine)
      .toggleBallPresence();
    //  On met à jour la variable qui stocke la position de la case avec la nouvelle position
    this.caseAtTheTime = this.boardCasesArray.find(
      (cas) => cas.ballPresence === true
    );
    // On met à jour la représentations graphique
    this.showBoard();
    // On place une conditions pour arrêter l'intervalle dans lequel sera placée la fonction. On la chosit grâce à la fonction dans la paranthèse.
    if (this.choseStopCondition()) {
      clearInterval(this.descentInterval);
      this.executeNextMove();
    }
  }

  ballInitialDescent() {
    this.newColumn = this.caseAtTheTime.column;
    this.moveType = "descent";
    this.descentInterval = setInterval(this.Blink.bind(this), 500);
  }

  ballInitialDescentIterator() {
    this.newLine =
      this.alphabet[
        this.alphabet.findIndex(
          (letter) => letter === this.caseAtTheTime.line
        ) + 1
      ];
  }

  ballInitialDescentStopCondition() {
    return (
      this.boardCasesArray.find((cas) => cas.ballPresence === true).line ===
      this.lineMax
    );
  }

  diagUpRight() {}

  diagUpLeft() {}

  choseMoveIterator() {
    if ((this.moveType = "descent")) this.ballInitialDescentIterator();
  }

  choseStopCondition() {
    if ((this.moveType = "descent"))
      return this.ballInitialDescentStopCondition();
  }

  executeNextMove() {
    console.log("execute next move");
    if (this.caseAtTheTime.line === this.lineMax) {
      if (this.caseAtTheTime.column === this.platePosition[0]) {
        if (this.caseAtTheTime.column === 1) {
          this.diagUpRight();
        } else {
          this.diagUpLeft();
        }
      } else if (this.caseAtTheTime.column === this.platePosition[1]) {
        if (this.caseAtTheTime.column === this.columnNumber) {
          this.diagUpLeft();
        } else {
          this.diagUpRight();
        }
      } else console.log("FAIL !!!");
    }
  }
}

const newGame = new GameCl(fixedForNowlineNumber, fixedForNowColumnNumber);
