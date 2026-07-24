import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.spotsHit = [];
    this.spotsMissed = [];
    this.gridSize = 10;
    this.grid = [[]];
    this.initializeGrid();
  }
  initializeGrid() {
    for (let i = 0; i < this.gridSize; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        this.grid[i][j] = new GameSpace();
      }
    }
  }
  placeShip(myShip, myPos) {
    let [posX, posY] = myPos;
    //check if ship goes off grid of position depending on direction placed
    for (let i = 0; i < myShip.myLength; i++) {
      if (posX < 0 || posX >= 10 || posY < 0 || posY >= 10) {
        throw new Error("Coordinates off board");
      }
      if (this.grid[posX][posY].shipOccupying != null) {
        //already has a ship in this space
        return false;
      }
      posX += myShip.direction[0];
      posY += myShip.direction[1];
    }
    //all spots are available so add the ship to these spaces..
    for (let j = 0; j < myShip.myLength; j++) {
      posX -= myShip.direction[0];
      posY -= myShip.direction[1];
      this.grid[posX][posY].setShip(myShip);
    }
    return true;
  }
  receiveAttack([attackX, attackY]) {
    //doesnt exist on board
    if (attackX < 0 || attackX >= 10 || attackY < 0 || attackY >= 10)
      throw new Error("Coordinates off board");
    //already hit
    if (this.grid[attackX][attackY].checkHit) return -1;

    let hitShip = false;
    if (hitShip === true) {
      //   this.spotsHit.push(attackPos);
      return 1;
    } else {
      //   this.spotsMissed.push(attackPos);
      return 0;
    }
  }
}
class GameSpace {
  constructor() {
    this.shipOccupying = null;
    this.isHit = false;
  }
  setShip(myShip) {
    this.shipOccupying = myShip;
  }
  checkHit() {
    return this.isHit;
  }
  hit() {
    this.isHit = true;
    if (this.shipOccupying !== null) {
      this.shipOccupying.hit();
    }
  }
}
const gb = new Gameboard();

const ship1 = new Ship(3);

console.log(gb.placeShip(ship1, [0, 0]));

console.log(ship1);
console.log(gb.grid);
