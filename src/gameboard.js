import { Ship } from "./ship.js";

export class Gameboard {
  constructor() {
    this.spotsHit = [];
    this.spotsMissed = [];
    this.gridSize = 10;
    this.grid = [[]];
    this.shipList = [];
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
  isAvailableSpot(myShip, myPos) {
    let [posX, posY] = myPos;
    //check if ship goes off grid of position depending on direction placed
    for (let i = 0; i < myShip.myLength; i++) {
      if (posX < 0 || posX >= 10 || posY < 0 || posY >= 10) {
        console.warn("Coordinates off board");
        return "off-board";
      }
      if (this.grid[posX][posY].shipOccupying != null) {
        //already has a ship in this space
        return "occupied";
      }
      posX += myShip.direction[0];
      posY += myShip.direction[1];
    }
    return "available";
  }
  placeShip(myShip, myPos) {
    let [posX, posY] = myPos;
    //check if ship goes off grid of position depending on direction placed
    const isValid = this.isAvailableSpot(myShip, myPos);
    if (isValid !== "available") return isValid;
    //all spots are available so add the ship to these spaces..
    for (let j = 0; j < myShip.myLength; j++) {
      this.grid[posX][posY].setShip(myShip);
      posX += myShip.direction[0];
      posY += myShip.direction[1];
    }
    this.shipList.push(myShip); //add to the list of ships
    return "placed";
  }
  receiveAttack([attackX, attackY]) {
    //doesnt exist on board
    if (attackX < 0 || attackX >= 10 || attackY < 0 || attackY >= 10) {
      console.warn("Coordinates off board");
      return "off-board";
    }
    //already hit
    if (this.grid[attackX][attackY].checkHit()) return "repeat";

    //can hit this spot on the gameboard grid
    this.grid[attackX][attackY].hit();
    //has ship on space
    if (this.grid[attackX][attackY].shipOccupying !== null) {
      this.spotsHit.push([attackX, attackY]);
      if (this.grid[attackX][attackY].shipOccupying.checkSunk()) {
        console.log(
          "You hit & sunk the " +
            this.grid[attackX][attackY].shipOccupying.getName(),
        );
        if (this.checkSunkAll() === true) {
          console.log("Sunk all ships game over");
          return "sunkAll";
        }
        return "sunk";
      }
      console.log(
        "You hit the " + this.grid[attackX][attackY].shipOccupying.getName(),
      );
      return "hit";
    }
    //no ship on space
    else {
      this.spotsMissed.push([attackX, attackY]);
      return "miss";
    }
  }
  checkSunkAll() {
    for (let i = 0; i < this.shipList.length; i++) {
      if (this.shipList[i].checkSunk() === false) {
        return false;
      }
    }
    return true;
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
// const gb = new Gameboard();

// const ship1 = new Ship(3);

// console.log(gb.placeShip(ship1, [0, 0]));

// console.log(ship1);
// console.log(gb.grid);
