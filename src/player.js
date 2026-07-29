import { Gameboard } from "./gameboard.js";

export class Player {
  constructor(isComputer = false) {
    this.isComputer = isComputer;
    this.playerBoard = new Gameboard();
  }
}
