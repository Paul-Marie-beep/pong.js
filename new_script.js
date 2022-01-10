"use strict";

// Constantes ficées pour dév (le nombre de colonnes doit être pair)
const fixedForNowColumnNumber = 12;
const fixedForNowlineNumber = 8;
let newGame;
/////////////////////////////////////////////////////////////////////////////////////////////////

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
const defeatPopUp = document.querySelector(".defeat-popup");
const defeatPopUpBtn = document.querySelector(".defeat-popup-button");
const defeatTitle = document.querySelector(".defeat-title");
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

class PlayAreaCl {
  constructor(lineNumber, columnNumber) {
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;

    this.boardCasesArray = [];

    this.createJsBoardCases();
    this.buildBoard();
    this.buildBase();
    this.newGame();
  }

  // On crée les cases dans lauquelle la balle va se mouvoir
  createJsBoardCases() {
    for (let i = 1; i <= this.lineNumber; i++) {
      for (let j = 1; j <= this.columnNumber; j++) {
        this.boardCasesArray.push(new boardCaseCl(alphabet[i - 1], j));
      }
    }
  }

  // On construit les cases où va évoluer la balle
  buildBoard() {
    board.innerHTML = "";
    this.boardCasesArray.forEach(function (cas) {
      const html = `<div class="case line-${cas.line} column-${cas.column}"></div></div>`;
      board.insertAdjacentHTML("beforeend", html);
    });
  }

  buildBase() {
    base.innerHTML = "";
    for (let i = 1; i < this.columnNumber + 1; i++) {
      let html;
      html = `<div class="case base--case base--case-${i}"><div class="plate plate-${i} hidden"></div></div>`;
      base.insertAdjacentHTML("beforeend", html);
    }
  }

  newGame() {
    newGame = new GameCl(
      this.lineNumber,
      this.columnNumber,
      this.boardCasesArray
    );
  }
}

class GameCl {
  platePosition = [];

  lineMax;
  // On initialise newLine à 0 parce que c'est sa position initiale pour la première descente
  newLine = "A";
  newColumn;
  caseAtTheTime;
  stopCondition;
  descentInterval;
  moveType;

  constructor(lineNumber, columnNumber, boardCasesArray) {
    this.lineNumber = lineNumber;
    this.columnNumber = columnNumber;
    this.boardCasesArray = boardCasesArray;

    this.platePosition = [];
    this.lineMax;
    // On initialise newLine à 0 parce que c'est sa position initiale pour la première descente
    this.newLine = "A";
    this.newColumn;
    this.caseAtTheTime;
    this.stopCondition;
    this.descentInterval;
    this.moveType;
    this.moveInterval;

    this.setBase();
    this.setBall();
    this.plateHandler();
    this.showPlateMoving();
    this.calcLineMax();
    this.ballInitialDescent();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // On commence  par créer le backend du jeu

  // On place d'office la palette au centre pour le début du jeu
  setBase() {
    this.platePosition = [];
    this.platePosition.unshift(this.columnNumber / 2);
    this.platePosition.push(this.columnNumber / 2 + 1);
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
    this.showBallPosition();
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////
  // On crée le front end

  // On montre la position de départ de la balle
  showBallPosition() {
    document.querySelectorAll(`.line-${this.caseAtTheTime.line}`)[
      this.caseAtTheTime.column - 1
    ].innerHTML = '<div class="ball"></div>';
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

  // On met à jour la représentation graphique en fonction des mouvements de la balle
  showBoard() {
    // On vide la  (ie la div) contenant la balle au préalable. On la vide en remontant à l'élement parent de la la balle et en supprimant le html de la div
    document.querySelector(".ball").parentElement.innerHTML = "";

    // On sélection la case où l'on doit mettre la balle et on la rajoute. On soustrait 1 car on la sélectionne par l'index d'une nodeliste, index qui commence donc à 0.
    this.showBallPosition();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  // On fait bouger la plateforme
  plateHandler() {
    document.addEventListener("keydown", this.listenerMethod.bind(this));
  }

  // On utilise une méthode séparée pour la fonction de l'event listener pour pouvoir lui faire passer un paramètre tout en bindant this à la classe game
  listenerMethod(event) {
    if (event.key === "ArrowLeft") {
      if (this.platePosition[0] === 1) return;
      this.platePosition.forEach((pos, i) => (this.platePosition[i] = pos - 1));
      this.showPlateMoving();
    }
    if (event.key === "ArrowRight") {
      if (this.platePosition[1] === this.columnNumber) return;
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
  startmove() {
    this.moveInterval = setInterval(() => {
      // On enlève la balle de la case qu'elle occupait jusqu'à présent
      this.boardCasesArray
        .find((cas) => cas.ballPresence === true)
        .toggleBallPresence();

      // On choisit l'itérateur qui va nous donner la nouvelle position de la balle
      this.choseMoveIterator();
      //  On met la balle dans sa nouvelle case
      this.boardCasesArray
        .find(
          (cas) => cas.column === this.newColumn && cas.line === this.newLine
        )
        .toggleBallPresence();
      //  On met à jour la variable qui stocke la position de la case avec la nouvelle position
      this.caseAtTheTime = this.boardCasesArray.find(
        (cas) => cas.ballPresence === true
      );
      // On met à jour la représentations graphique
      this.showBoard();
      // On place une conditions pour arrêter l'intervalle dans lequel sera placée la fonction. On la chosit grâce à la fonction dans la paranthèse.
      if (this.choseStopCondition()) {
        this.executeNextMove();
      }
    }, 200);
  }

  // Fontion qui lance la  descente initale: particulière car s'effectue en diagonale
  ballInitialDescent() {
    this.newColumn = this.caseAtTheTime.column;
    this.moveType = "descent";
    this.startmove();
  }

  // Itérateur pour la descente verticale
  ballInitialDescentIterator() {
    this.newLine =
      alphabet[
        alphabet.findIndex((letter) => letter === this.caseAtTheTime.line) + 1
      ];
  }

  // Condition d'arrêt du mouvement pour la descente verticale
  ballInitialDescentStopCondition() {
    return (
      this.boardCasesArray.find((cas) => cas.ballPresence === true).line ===
      this.lineMax
    );
  }

  // On écrit nos méthodes pour les autres types de mouvements qui seront nécessairement diagonaux. Cf. la méthode initiale descent pour une meilleure compréhension, le comportement des méthodes suivantes en découle.
  diagUpRight() {
    this.moveType = "upRight";
    this.startmove();
  }

  upRightIterator() {
    this.newLine =
      alphabet[
        alphabet.findIndex((letter) => letter === this.caseAtTheTime.line) - 1
      ];
    this.newColumn = this.caseAtTheTime.column + 1;
  }

  upRightStopCondition() {
    return (
      (this.caseAtTheTime.column === this.columnNumber &&
        this.caseAtTheTime.line != "A") ||
      (this.caseAtTheTime.line === "A" &&
        this.caseAtTheTime.column != this.columnNumber) ||
      (this.caseAtTheTime.line === "A" &&
        this.caseAtTheTime.column === this.columnNumber)
    );
  }

  diagUpLeft() {
    this.moveType = "upLeft";
    this.startmove();
  }

  upLeftIterator() {
    this.newLine =
      alphabet[
        alphabet.findIndex((letter) => letter === this.caseAtTheTime.line) - 1
      ];
    this.newColumn = this.caseAtTheTime.column - 1;
  }

  upLeftStopCondition() {
    return (
      (this.caseAtTheTime.column === 1 && this.caseAtTheTime.line != "A") ||
      (this.caseAtTheTime.line === "A" && this.caseAtTheTime.column != 1) ||
      (this.caseAtTheTime.line === "A" && this.caseAtTheTime.column === 1)
    );
  }

  diagDownLeft() {
    this.moveType = "downLeft";
    this.startmove();
  }

  downLeftIterator() {
    this.newLine =
      alphabet[
        alphabet.findIndex((letter) => letter === this.caseAtTheTime.line) + 1
      ];
    this.newColumn = this.caseAtTheTime.column - 1;
  }

  downLeftStopCondition() {
    return (
      (this.caseAtTheTime.column === 1 &&
        this.caseAtTheTime.line != this.lineMax) ||
      this.caseAtTheTime.line === this.lineMax
    );
  }

  diagDownRight() {
    this.moveType = "downRight";
    this.startmove();
  }

  downRightIterator() {
    this.newLine =
      alphabet[
        alphabet.findIndex((letter) => letter === this.caseAtTheTime.line) + 1
      ];
    this.newColumn = this.caseAtTheTime.column + 1;
  }

  downRightStopCondition() {
    return (
      this.caseAtTheTime.column === this.columnNumber ||
      this.caseAtTheTime.line === this.lineMax
    );
  }

  // Cette fonction nous permet d'injecter le bon itérateur dans la fonction blink
  choseMoveIterator() {
    if (this.moveType === "descent") this.ballInitialDescentIterator();
    if (this.moveType === "upRight") this.upRightIterator();
    if (this.moveType === "upLeft") this.upLeftIterator();
    if (this.moveType === "downLeft") this.downLeftIterator();
    if (this.moveType === "downRight") this.downRightIterator();
  }

  // Cette fonction nous permet de sélectionner les bonnes conditions d'arrêt à renvoyer dans la fonction blink Chaque fonction particulière retourne les conditions voulues
  choseStopCondition() {
    if (this.moveType === "descent")
      return this.ballInitialDescentStopCondition();
    if (this.moveType === "upRight") return this.upRightStopCondition();
    if (this.moveType === "upLeft") return this.upLeftStopCondition();
    if (this.moveType === "downLeft") return this.downLeftStopCondition();
    if (this.moveType === "downRight") return this.downRightStopCondition();
  }

  // Cette fonction définir le prochain mouvement quand la balle touche un rebord du cadre ou la palette.
  executeNextMove() {
    // On commence par arrêter l'intervalle avant d'en recréer un autre
    clearInterval(this.moveInterval);

    // On regarde comment doit réagir la balle en fonction des événements
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
      } else this.defeat();
    }

    if (this.moveType === "upRight") {
      if (
        this.caseAtTheTime.column === this.columnNumber &&
        this.caseAtTheTime.line != "A"
      ) {
        this.diagUpLeft();
      }
      if (
        this.caseAtTheTime.line === "A" &&
        this.caseAtTheTime.column != this.columnNumber
      ) {
        this.diagDownRight();
      }
      if (
        this.caseAtTheTime.line === "A" &&
        this.caseAtTheTime.column === this.columnNumber
      ) {
        this.diagDownLeft();
      }
    }
    if (this.moveType === "upLeft") {
      if (this.caseAtTheTime.column === 1 && this.caseAtTheTime.line != "A")
        this.diagUpRight();
      if (this.caseAtTheTime.line === "A" && this.caseAtTheTime.column != 1)
        this.diagDownLeft();
      if (this.caseAtTheTime.line === "A" && this.caseAtTheTime.column === 1)
        this.diagDownRight();
    }
    if (
      this.moveType === "downLeft" &&
      this.caseAtTheTime.line != this.lineMax &&
      this.caseAtTheTime.column === 1
    )
      this.diagDownRight();

    if (
      this.moveType === "downRight" &&
      this.caseAtTheTime.line != this.lineMax &&
      this.caseAtTheTime.column === this.columnNumber
    )
      this.diagDownLeft();
  }

  // Qu'est-ce qui se passe en cas de défaite ?
  defeat() {
    defeatPopUp.classList.remove("hidden");
    document.querySelector(".ball").parentElement.innerHTML = "";
    // On ne peut pas utiliser de constante globale pour la balle car on doit la sélectionner en "temps réel" et non au début de l'exécution du programme.

    this.boardCasesArray
      .find((cas) => cas.ballPresence === true)
      .toggleBallPresence();

    this.startAgain();
  }

  startAgain() {
    const relaunchGame = () => {
      defeatPopUpBtn.removeEventListener("click", relaunchGame);

      defeatPopUp.classList.add("hidden");
      this.setBase();
      this.setBall();
      this.showPlateMoving();
      this.ballInitialDescent();
    };
    defeatPopUpBtn.addEventListener("click", relaunchGame);
  }
}

const newPlayArea = new PlayAreaCl(
  fixedForNowlineNumber,
  fixedForNowColumnNumber
);
