export class Ship {
  constructor(myLength = 1) {
    this.myLength = myLength;
    this.isSunk = false;
    this.numHits = 0;
    this.direction = [1, 0];
  }
  hit() {
    this.numHits++;
    this.isSunk = this.checkSunk();
  }
  checkSunk() {
    if (this.numHits >= this.myLength) {
      return true;
    }
    return false;
  }
  setDirection(myDir) {
    //[1,0] is to right [-1,0] to left
    //[0,1] is to up [0,-1] to down
    this.direction = myDir;
  }
}
