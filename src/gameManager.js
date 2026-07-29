import "./styles.css";
import { Player } from "./player.js";
import { Gameboard } from "./gameboard.js";
const domReference = document.querySelectorAll(".test");
class GameManager {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.htmlBoard = [];
    this.gridSize = 10;
    this.initializeGridButtons();
  }
  initializeGridButtons() {
    for (let i = 0; i < this.gridSize; i++) {
      this.htmlBoard[i] = [];
      for (let j = 0; j < this.gridSize; j++) {
        const gameButton = document.createElement("button");
        gameButton.setAttribute("id", `${j},${i}`);
        gameButton.classList.add("game-button");
        gameButton.addEventListener("click", () => {
          console.log(gameButton.id);
          return gameButton.id;
        });
        console.log(gameButton);
        domReference[i].appendChild(gameButton);
        this.htmlBoard[i][j] = gameButton;
      }
    }
  }
}
// console.log(domReference);
const GM = new GameManager();
