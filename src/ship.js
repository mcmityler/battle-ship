export class Ship {
  constructor(myLength = 1, myName = "Destroyer") {
    this.myLength = myLength;
    this.numHits = 0;
    this.direction = [1, 0];
    this.shipName = myName;
    this.isPlaced = false;
  }
  hit() {
    this.numHits++;
    return this.numHits;
  }
  checkSunk() {
    if (this.numHits >= this.myLength) {
      return true;
    }
    return false;
  }
  place() {
    this.isPlaced = true;
  }
  setDirection(myDir) {
    //[1,0] is to right [-1,0] to left
    //[0,1] is to up [0,-1] to down
    this.direction = myDir;
  }
  setName(myName) {
    this.shipName = myName;
  }
  getName() {
    return this.shipName;
  }
}
