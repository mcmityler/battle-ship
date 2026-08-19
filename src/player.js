import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.playerBoard = new Gameboard();
    this.playerName = this.isComputer === false ? "Player 1" : "Computer";
  }
}
