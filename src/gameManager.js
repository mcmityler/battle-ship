import "./styles.css";
import { Player } from "./player.js";
import { Gameboard, GameSpace } from "./gameboard.js";
const shipRowContainer = document.querySelector(".ship-grid-container");
const shotRowContainer = document.querySelector(".shot-grid-container");
const playerShipsText = document.querySelector(".player-ships");
const playerShotsText = document.querySelector(".player-shots");
class GameManager {
  constructor() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.shipBoard = [];
    this.shotBoard = [];
    this.gridSize = 10;
    this.playersTurn = 1;
    this.nextTurn = false; //is it the next persons turn
    this.computerThinking = false;

    this.changeTurnButton = document.querySelector(".turn-change-button");
    // this.changeTurnButton.classList.add("hidden");
    this.changeTurnButton.addEventListener("click", () => this.changeTurns());

    this.startGameForm = document.getElementById("new-game-form");
    this.startGameForm.addEventListener("submit", (event) =>
      this.startGame(event),
    );
    this.currentTurnTextbox = document.querySelector(".current-turn");
  }
  startGame(event) {
    // 1. Prevent the default browser page reload
    event.preventDefault();
    // 2. Instantiate FormData by passing the form element
    const formData = new FormData(event.target);
    console.log(formData);
    console.log(formData.get("p1-input"));
    console.log(formData.has("computer-input"));
    console.log(formData.get("p2-input"));
    console.log(formData.get("difficulty-selector"));

    //set player 1 name (default: Player 1)
    this.player1.playerName =
      formData.get("p1-input") == "" ? "Player 1" : formData.get("p1-input");
    //check if player 2 is a computer
    this.player2.isComputer = formData.has("computer-input");
    //check if player 2 has a name (Default: Player 2 or Computer)
    this.player2.isComputer === false
      ? (this.player2.playerName =
          formData.get("p2-input") == ""
            ? "Player 2"
            : formData.get("p2-input"))
      : (this.player2.playerName = "Computer");

    //set texts to player 1's name
    playerShipsText.textContent = `${this.player1.playerName}'s Ships`;
    playerShotsText.textContent = `${this.player1.playerName}'s Shots`;

    this.initializeGridButtons();
    this.populateBoard();
    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2, //current player
      this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
    );
    //close inputs
    this.startGameForm.parentElement.parentElement.close();

    this.startGameForm.reset(); //clear form inputs
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
    if (this.computerThinking === true) return;
    const [y, x, type] = myID.split(" ");
    console.log(`(Y:${y},X:${x}) - ${type}` + " cell clicked");

    //if y,x-shot
    if (type === "shot" && this.nextTurn === false) {
      //result of what shot will be
      let shotResult = "";
      if (this.playersTurn === 1) {
        //if P1 turn attack P2 board and vice versa
        shotResult = this.player2.playerBoard.receiveAttack([y, x]);
      } else if (this.playersTurn === 2) {
        if (this.player2.isComputer === true) {
          this.currentTurnTextbox.textContent = `Computer`;
          //timeout to make it feel like the computer is doing something
          this.computerThinking = true;
          setTimeout(() => this.computerHit(), 400);

          return;
        } else {
          shotResult = this.player1.playerBoard.receiveAttack([y, x]);
        }
      }
      console.log(shotResult);

      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2,
        this.playersTurn === 1 ? this.player2 : this.player1,
      );
      if (this.player2.isComputer === false) {
        this.changeTurnButton.classList.remove("hidden");
        this.nextTurn = true;
      } else {
        //Make a computer move here
        this.computerMove();
      }
    }

    //if y,x-ship
  }
  computerMove() {
    this.changeTurns();
    this.gridcellClick(
      `${Math.floor(Math.random() * 10)} ${Math.floor(
        Math.random() * 10,
      )} shot`,
    );
  }
  computerHit() {
    let hit = false;
    let shotResult = "";
    while (hit === false) {
      shotResult = this.player1.playerBoard.receiveAttack([
        Math.floor(Math.random() * 10),
        Math.floor(Math.random() * 10),
      ]);
      console.log("computer hit");
      if (
        shotResult === "miss" ||
        shotResult === "hit" ||
        shotResult === "sunk"
      ) {
        hit = true;
      }
    }
    this.displayBoard(this.player1, this.player2);

    this.changeTurns();

    this.currentTurnTextbox.textContent = `${this.player1.playerName}`;
    //done making a move, user can now strike
    this.computerThinking = false;
  }
  changeTurns() {
    this.playersTurn === 1 ? (this.playersTurn = 2) : (this.playersTurn = 1);
    if (this.player2.isComputer === false) {
      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2, //current player
        this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
      );
    }
    this.nextTurn = false;
    // this.changeTurnButton.classList.add("hidden");
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
    playerShipsText.textContent = `${currentPlayer.playerName}'s Ships`;
    playerShotsText.textContent = `${currentPlayer.playerName}'s Shots`;
    this.currentTurnTextbox.textContent = `${currentPlayer.playerName}`;
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
