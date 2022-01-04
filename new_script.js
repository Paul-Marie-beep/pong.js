"use strict";

// Constantes ficées pour dév (le nombre de colonnes doit être pair)
const fixedForNowColumnNumber = 12;
const fixedForNowlineNumber = 8;
/////////////////////////////////////////////////////////////////////////////////////////////////

class CaseCl {
  constructor(column) {
    this.column = column;
  }
}

class baseCaseCl extends CaseCl {
  constructor(column) {
    super(column);
    this.platePresence = false;
  }
}

class boardCaseCl extends CaseCl {
  constructor(column, line) {
    super(column);
    this.line = line;
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

  constructor(columnNumber, lineNumber) {
    this.columnNumber = columnNumber;
    this.lineNumber = lineNumber;

    this.createJsBaseCases();
    this.setBase();
    this.createJsBoardCases();
    this.setBall();
  }

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
    this.baseCasesArray.find(
      (cas) => cas.column === ballInitialColumn
    ).ballPresence = true;
  }

  // On crée le front end

  // On va construire la base dans laquelle la palette va bouger
}

const newGame = new GameCl(fixedForNowColumnNumber, fixedForNowlineNumber);
