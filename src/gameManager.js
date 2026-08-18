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
    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2, //current player
      this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
    );
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
      //result of what shot will be
      let shotResult = "";
      if (this.playersTurn === 1) {
        //if P1 turn attack P2 board and vice versa
        shotResult = this.player2.playerBoard.receiveAttack([y, x]);
      } else if (this.playersTurn === 2) {
        shotResult = this.player1.playerBoard.receiveAttack([y, x]);
      }
      console.log(shotResult);
      if (shotResult === "repeat") {
        console.log("return repeat");
        return;
      } else if (shotResult === "miss") {
        document.getElementById(`${y} ${x} shot`).classList.add("miss");
      } else if (shotResult === "hit") {
        document.getElementById(`${y} ${x} shot`).classList.add("hit");
      } else if (shotResult === "sunk" || shotResult === "sunkAll") {
        //cycle over the ships cells and turn them all into sunk
        let shipLength = 0;
        let startingCord = [];
        let direction = [];
        if (this.playersTurn === 1) {
          shipLength =
            this.player2.playerBoard.grid[y][x].shipOccupying.myLength;
          startingCord =
            this.player2.playerBoard.grid[y][x].shipOccupying.startCell;
          direction =
            this.player2.playerBoard.grid[y][x].shipOccupying.direction;
        } else if (this.playersTurn === 2) {
          shipLength =
            this.player1.playerBoard.grid[y][x].shipOccupying.myLength;
          startingCord =
            this.player1.playerBoard.grid[y][x].shipOccupying.startCell;
          direction =
            this.player1.playerBoard.grid[y][x].shipOccupying.direction;
        }
        for (let i = 0; i < shipLength; i++) {
          document
            .getElementById(
              `${startingCord[0] + direction[0] * i} ${startingCord[1] + direction[1] * i} shot`,
            )
            .classList.add("sunk");
        }
      }
    }
    //if y,x-ship
  }
  changeTurns() {
    this.playersTurn === 1 ? (this.playersTurn = 2) : (this.playersTurn = 1);
    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2, //current player
      this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
    );
  }
  randomShipPlacement(myShip, currentPlayer) {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    while (myShip.isPlaced === false) {
      console.log("hey");
      myShip.setDirection(directions[Math.floor(Math.random() * 4)]);
      currentPlayer.playerBoard.placeShip(myShip, [
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]);
    }
  }
  randomizeBoard(playerToRandomize) {
    playerToRandomize.playerBoard.initializeGrid();
    this.randomShipPlacement(
      playerToRandomize.playerBoard.carrier,
      playerToRandomize,
    );
    this.randomShipPlacement(
      playerToRandomize.playerBoard.battleship,
      playerToRandomize,
    );
    this.randomShipPlacement(
      playerToRandomize.playerBoard.cruiser,
      playerToRandomize,
    );
    this.randomShipPlacement(
      playerToRandomize.playerBoard.submarine,
      playerToRandomize,
    );
    this.randomShipPlacement(
      playerToRandomize.playerBoard.destroyer,
      playerToRandomize,
    );
  }
  populateBoard() {
    //populates using (y,x) coordinates
    this.randomizeBoard(this.player1);
    this.randomizeBoard(this.player2);
  }
  displayBoard(currentPlayer, opponentPlayer) {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        //erase all class list on ship board
        this.shipBoard[y][x].classList = "game-button";
        //display where ships are located
        if (currentPlayer.playerBoard.grid[y][x].shipOccupying !== null) {
          // console.log(currentPlayer.playerBoard.grid[y][x].shipOccupying);
          this.shipBoard[y][x].classList.add("ship");
        }
        //erase all class list on shot board
        this.shotBoard[y][x].classList = "game-button";
      }
    }
    //Display where OPPONENT hit on YOUR ship board
    currentPlayer.playerBoard.spotsHit.forEach((element) => {
      const [y, x] = element;
      //check if sunk or just a hit
      if (
        currentPlayer.playerBoard.grid[y][x].shipOccupying.checkSunk() === true
      ) {
        this.shipBoard[y][x].classList.add("sunk");
      } else {
        this.shipBoard[y][x].classList.add("hit");
      }
    });
    currentPlayer.playerBoard.spotsMissed.forEach((element) => {
      const [y, x] = element;
      this.shipBoard[y][x].classList.add("miss");
    });
    //Display where YOU hit on the OPPONENT board
    opponentPlayer.playerBoard.spotsHit.forEach((element) => {
      const [y, x] = element;
      //check if sunk or just a hit
      if (
        opponentPlayer.playerBoard.grid[y][x].shipOccupying.checkSunk() === true
      ) {
        this.shotBoard[y][x].classList.add("sunk");
      } else {
        this.shotBoard[y][x].classList.add("hit");
      }
    });
    opponentPlayer.playerBoard.spotsMissed.forEach((element) => {
      const [y, x] = element;
      this.shotBoard[y][x].classList.add("miss");
    });
  }
}
// console.log(domReference);
const GM = new GameManager();
