export class Ship {
  constructor(myLength = 1, myName = "Destroyer") {
    this.myLength = myLength;
    this.numHits = 0;
    this.direction = [0, 1];
    this.shipName = myName;
    this.isPlaced = false;
    this.startCell = [];
  }
  hit() {
    this.numHits++;
    return this.numHits;
  }
  hitsLeft() {
    return this.myLength - this.numHits;
  }
  checkSunk() {
    if (this.numHits >= this.myLength) {
      return true;
    }
    return false;
  }
  place(myPos) {
    this.isPlaced = true;
    this.startCell = myPos;
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
