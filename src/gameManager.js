import "./styles.css";
import { Player } from "./player.js";
import { Gameboard, GameSpace } from "./gameboard.js";
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
    this.playersTurn = 1;
    this.populateBoard();
    this.showShips();
  }
  initializeGridButtons() {
    for (let y = 0; y < this.gridSize; y++) {
      //create rows to put buttons on in html
      const shipRow = document.createElement("div");
      const shotRow = document.createElement("div");

      //holds all buttons to be referenced later if need to loop all of them
      this.shipBoard[y] = [];
      this.shotBoard[y] = [];

      for (let x = 0; x < this.gridSize; x++) {
        //create ship buttons (top screen)
        const shipButton = document.createElement("button");
        shipButton.setAttribute("id", `${y} ${x} ship`);
        shipButton.classList.add("game-button");
        shipButton.addEventListener("click", () => {
          this.gridcellClick(shipButton.id);
        });
        shipRow.appendChild(shipButton);
        this.shipBoard[y][x] = shipButton;

        //create shot buttons (bot screen)
        const shotButton = document.createElement("button");
        shotButton.setAttribute("id", `${y} ${x} shot`);
        shotButton.classList.add("game-button");
        shotButton.addEventListener("click", () => {
          this.gridcellClick(shotButton.id);
        });
        shotRow.appendChild(shotButton);
        this.shotBoard[y][x] = shotButton;
      }
      shipRowContainer.appendChild(shipRow);
      shotRowContainer.appendChild(shotRow);
    }
  }
  gridcellClick(myID) {
    const [y, x, type] = myID.split(" ");
    console.log(`(Y:${y},X:${x}) - ${type}` + " cell clicked");
    //if y,x-shot
    if (type === "shot") {
      //check if it was a hit on a ship or a miss or already clicked.
      document.getElementById(`${y} ${x} shot`).classList.add("miss");
    }
    //if y,x-ship
  }
  populateBoard() {
    //populates using (y,x) coordinates
    this.player1.playerBoard.placeShip(
      this.player1.playerBoard.carrier,
      [0, 0],
    );
    this.player1.playerBoard.placeShip(
      this.player1.playerBoard.battleship,
      [2, 0],
    );
    this.player1.playerBoard.placeShip(
      this.player1.playerBoard.cruiser,
      [4, 0],
    );
    this.player1.playerBoard.placeShip(
      this.player1.playerBoard.submarine,
      [6, 0],
    );
    this.player1.playerBoard.placeShip(
      this.player1.playerBoard.destroyer,
      [8, 0],
    );

    this.player2.playerBoard.placeShip(
      this.player2.playerBoard.carrier,
      [1, 0],
    );
    this.player2.playerBoard.placeShip(
      this.player2.playerBoard.battleship,
      [2, 0],
    );
    this.player2.playerBoard.placeShip(
      this.player2.playerBoard.cruiser,
      [3, 0],
    );
    this.player2.playerBoard.placeShip(
      this.player2.playerBoard.submarine,
      [4, 0],
    );
    this.player2.playerBoard.placeShip(
      this.player2.playerBoard.destroyer,
      [5, 0],
    );
  }
  showShips() {
    if (this.playersTurn === 1) {
      //show player 1's ships in ship column
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          this.shipBoard[y][x].classList.remove("hit");
          if (this.player1.playerBoard.grid[y][x].shipOccupying !== null) {
            console.log(this.player1.playerBoard.grid[y][x].shipOccupying);
            this.shipBoard[y][x].classList.add("hit");
          }
        }
      }
    }
    if (this.playersTurn === 2) {
      //show player 1's ships in ship column
      for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
          this.shipBoard[y][x].classList.remove("hit");
          if (this.player2.playerBoard.grid[y][x].shipOccupying !== null) {
            console.log(this.player2.playerBoard.grid[y][x].shipOccupying);
            this.shipBoard[y][x].classList.add("hit");
          }
        }
      }
    }
  }
}
// console.log(domReference);
const GM = new GameManager();
