import "./styles.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
const shipRows = document.querySelectorAll(".shipRow");
const shotRows = document.querySelectorAll(".shotRow");
class GameManager {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.shipBoard = [];
    this.shotBoard = [];
    this.gridSize = 10;
    this.initializeGridButtons();
  }
  initializeGridButtons() {
    for (let i = 0; i < this.gridSize; i++) {
      this.shipBoard[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        const gameButton = document.createElement("button");
        gameButton.setAttribute("id", `${j} ${i} ship`);
        gameButton.classList.add("game-button");
        gameButton.addEventListener("click", () => {
          this.gridcellClick(gameButton.id);
        });
        shipRows[i].appendChild(gameButton);
        this.shipBoard[i][j] = gameButton;
      }
      this.shotBoard[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        const gameButton = document.createElement("button");
        gameButton.setAttribute("id", `${j} ${i} shot`);
        gameButton.classList.add("game-button");
        gameButton.addEventListener("click", () => {
          this.gridcellClick(gameButton.id);
        });
        shotRows[i].appendChild(gameButton);
        this.shotBoard[i][j] = gameButton;
      }
    }
  }
  gridcellClick(myID) {
    const [x, y, type] = myID.split(" ");
    console.log(`(${x},${y}) - ${type}` + " cell clicked");
    //if x,y-shot

    //if x,y-ship
  }
}
// console.log(domReference);
const GM = new GameManager();
