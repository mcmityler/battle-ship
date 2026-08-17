import "./styles.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
const shipRowContainer = document.querySelector(".ship-grid-container");
const shotRowContainer = document.querySelector(".shot-grid-container");
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
      //create rows to put buttons on in html
      const shipRow = document.createElement("div");
      const shotRow = document.createElement("div");

      //holds all buttons to be referenced later if need to loop all of them
      this.shipBoard[i] = [];
      this.shotBoard[i] = [];

      for (let j = 0; j < this.gridSize; j++) {
        //create ship buttons (top screen)
        const shipButton = document.createElement("button");
        shipButton.setAttribute("id", `${j} ${i} ship`);
        shipButton.classList.add("game-button");
        shipButton.addEventListener("click", () => {
          this.gridcellClick(shipButton.id);
        });
        shipRow.appendChild(shipButton);
        this.shipBoard[i][j] = shipButton;

        //create shot buttons (bot screen)
        const shotButton = document.createElement("button");
        shotButton.setAttribute("id", `${j} ${i} shot`);
        shotButton.classList.add("game-button");
        shotButton.addEventListener("click", () => {
          this.gridcellClick(shotButton.id);
        });
        shotRow.appendChild(shotButton);
        this.shotBoard[i][j] = shotButton;
      }
      shipRowContainer.appendChild(shipRow);
      shotRowContainer.appendChild(shotRow);
    }
  }
  gridcellClick(myID) {
    const [x, y, type] = myID.split(" ");
    console.log(`(${x},${y}) - ${type}` + " cell clicked");
    //if x,y-shot
    if (type === "shot") {
      //check if it was a hit on a ship or a miss or already clicked.
      document.getElementById(`${x} ${y} shot`).classList.add("miss");
    }
    //if x,y-ship
  }
}
// console.log(domReference);
const GM = new GameManager();
