import "./styles.css";
import { Player } from "./player.js";
import { Gameboard, GameSpace } from "./gameboard.js";
const shipRowContainer = document.querySelector(".ship-grid-container");
const shotRowContainer = document.querySelector(".shot-grid-container");
const playerShipsText = document.querySelector(".player-ships");
const playerShotsText = document.querySelector(".player-shots");
class GameManager {
  constructor() {
    //variables
    this.player1 = new Player();
    this.player2 = new Player();
    this.shipBoard = [];
    this.shotBoard = [];
    this.gridSize = 10;
    this.playersTurn = 1;
    this.nextTurn = false; //is it the next persons turn
    this.computerThinking = false;
    this.player1Placed = false; //has the player confirmed the placement of their ships
    this.player2Placed = false; // ^
    this.randomizedClicked = false; // has the player randomized the board once

    //references to DOM elements
    this.initHTMLReferences();
  }
  initHTMLReferences() {
    //new game dialog
    this.startGameForm = document.getElementById("new-game-form");
    this.startGameForm.addEventListener("submit", (event) =>
      this.startGame(event),
    );
    //click to continue dialog
    this.clickDialog = document.getElementById("click-dialog");
    this.passText = document.querySelector(".pass-text");
    this.clickButton = document.querySelector(".click-button");
    this.clickButton.addEventListener("click", () => this.clickToContinue());

    //Game over dialog
    console.log("put game over dialog references here");

    //boat status summary section
    this.carrierStatus = document.querySelector(".carrier-status");
    this.carrierHitsLeft = document.querySelector(".carrier-hits-left");
    this.carrierText = document.querySelector(".carrier-text");

    this.battleshipStatus = document.querySelector(".battleship-status");
    this.battleshipHitsLeft = document.querySelector(".battleship-hits-left");
    this.battleshipText = document.querySelector(".battleship-text");

    this.cruiserStatus = document.querySelector(".cruiser-status");
    this.cruiserHitsLeft = document.querySelector(".cruiser-hits-left");
    this.cruiserText = document.querySelector(".cruiser-text");

    this.submarineStatus = document.querySelector(".submarine-status");
    this.submarineHitsLeft = document.querySelector(".submarine-hits-left");
    this.submarineText = document.querySelector(".submarine-text");

    this.destroyerStatus = document.querySelector(".destroyer-status");
    this.destroyerHitsLeft = document.querySelector(".destroyer-hits-left");
    this.destroyerText = document.querySelector(".destroyer-text");

    //randomize boat section
    this.boatRandomizeContainer = document.querySelector(
      ".boat-swap-container",
    );

    this.randomizerName = document.querySelector(".pName-randomizer");

    this.randomizeButton = document.querySelector(".random-placement-button");
    this.randomizeButton.addEventListener("click", () => {
      this.randomizeBoard(this.playersTurn === 1 ? this.player1 : this.player2);
      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2,
        this.playersTurn === 1 ? this.player2 : this.player1,
      );
    });

    this.confirmButton = document.querySelector(".confirm-placement-button");
    this.confirmButton.addEventListener("click", () => this.confirmPlacement());

    //change turn section
    this.currentTurnTextbox = document.querySelector(".current-turn");

    this.changeTurnButton = document.querySelector(".turn-change-button");
    this.changeTurnButton.classList.add("hidden");
    this.changeTurnButton.addEventListener("click", () =>
      this.changeTurns(true),
    );

    this.changeTurnContainer = document.querySelector(
      ".change-turns-container",
    );
    this.changeTurnContainer.classList.remove("open-container");

    //Player shot history section
    this.p1Shots = document.querySelector(".p1-shots");
    this.p2Shots = document.querySelector(".p2-shots");
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
    // this.populateBoard();
    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2, //current player
      this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
    );

    if (this.playersTurn === 1) {
      this.currentTurnTextbox.classList.add("p1-color");
      this.currentTurnTextbox.classList.remove("p2-color");
    } else if (this.playersTurn === 2) {
      this.currentTurnTextbox.classList.remove("p1-color");
      this.currentTurnTextbox.classList.add("p2-color");
    }

    this.randomizerName.textContent = this.player1.playerName;
    this.p1Shots.textContent = "";
    this.p2Shots.textContent = "";

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
    if (this.player1Placed === false || this.player2Placed === false) return;
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
      if (shotResult === "repeat") return; //ensure you cant hit same spot twice and waste a turn

      console.log(shotResult);

      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2,
        this.playersTurn === 1 ? this.player2 : this.player1,
      );
      //not a repeat and actually hit something so add it
      if (this.playersTurn === 1) {
        this.p1Shots.textContent += ` [${+x + 1},${+y + 1}]`;
      }
      if (this.player2.isComputer === false) {
        this.changeTurnContainer.classList.add("open-container");
        setTimeout(() => this.changeTurnButton.classList.remove("hidden"), 200);
        this.nextTurn = true;

        if (this.playersTurn === 2) {
          this.p2Shots.textContent += ` [${+x + 1},${+y + 1}]`;
        }
      } else {
        //Make a computer move here
        this.computerMove();
      }
    }

    //if y,x-ship
  }
  computerMove() {
    this.changeTurns();
    this.greyOut();
    this.gridcellClick(
      `${Math.floor(Math.random() * 10)} ${Math.floor(
        Math.random() * 10,
      )} shot`,
    );
  }
  greyOut() {
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        this.shotBoard[y][x].classList.toggle("greyed-out");
      }
    }
  }
  computerHit() {
    let hit = false;
    while (hit === false) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      let shotResult = this.player1.playerBoard.receiveAttack([y, x]);
      console.log("computer hit");
      if (
        shotResult === "miss" ||
        shotResult === "hit" ||
        shotResult === "sunk"
      ) {
        hit = true;
        this.p2Shots.textContent += ` [${x + 1},${y + 1}]`;
      }
    }
    this.displayBoard(this.player1, this.player2);

    this.changeTurns();

    this.currentTurnTextbox.textContent = `${this.player1.playerName}`;
    //done making a move, user can now strike
    this.computerThinking = false;
  }
  changeTurns(buttonClick = false) {
    this.playersTurn === 1 ? (this.playersTurn = 2) : (this.playersTurn = 1);
    console.log("CHANGE TURN" + this.playersTurn);
    if (
      this.player2.isComputer === false ||
      (this.playersTurn === 1 && buttonClick === false)
    ) {
      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2, //current player
        this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
      );
    }
    if (buttonClick === true) {
      //open click to continue and clear the boards
      this.clickDialog.showModal();
    }
    if (this.playersTurn === 1) {
      this.currentTurnTextbox.classList.add("p1-color");
      this.currentTurnTextbox.classList.remove("p2-color");
    } else if (this.playersTurn === 2) {
      this.currentTurnTextbox.classList.remove("p1-color");
      this.currentTurnTextbox.classList.add("p2-color");
    }
    this.nextTurn = false;
    this.changeTurnContainer.classList.remove("open-container");

    this.changeTurnButton.classList.add("hidden");
  }
  clickToContinue() {
    this.clickDialog.close();
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
    playerToRandomize.playerBoard.resetShipPlacement();
    this.randomizedClicked = true;
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
  confirmPlacement() {
    if (this.randomizedClicked === false) {
      this.randomizeBoard(this.playersTurn === 1 ? this.player1 : this.player2);
      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2, //current player
        this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
      );
    }
    this.randomizerName.textContent = this.player2.playerName;

    this.randomizedClicked = false;
    if (this.playersTurn === 1) {
      this.player1Placed = true;
    } else {
      this.player2Placed = true;
    }
    this.changeTurns();
    if (this.player2.isComputer === true && this.player2Placed === false) {
      //if computer randomize and confirm placement tos start game
      this.randomizeBoard(this.player2);
      this.confirmPlacement();
    }
    if (this.player1Placed === true && this.player2Placed === true) {
      //hide the boat randomizer
      this.boatRandomizeContainer.classList.add("hidden");
    }
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

    if (this.player2.isComputer === false || this.playersTurn === 1) {
      this.updateBoatSummary();
    }
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
  updateBoatSummary() {
    const currentOpponent =
      this.playersTurn === 1 ? this.player2 : this.player1;
    this.updateBoatStatus(
      currentOpponent.playerBoard.carrier,
      this.carrierStatus,
      this.carrierText,
      this.carrierHitsLeft,
    );
    this.updateBoatStatus(
      currentOpponent.playerBoard.battleship,
      this.cruiserStatus,
      this.cruiserText,
      this.cruiserHitsLeft,
    );
    this.updateBoatStatus(
      currentOpponent.playerBoard.cruiser,
      this.battleshipStatus,
      this.battleshipText,
      this.battleshipHitsLeft,
    );
    this.updateBoatStatus(
      currentOpponent.playerBoard.submarine,
      this.submarineStatus,
      this.submarineText,
      this.submarineHitsLeft,
    );
    this.updateBoatStatus(
      currentOpponent.playerBoard.destroyer,
      this.destroyerStatus,
      this.destroyerText,
      this.destroyerHitsLeft,
    );
  }
  updateBoatStatus(boat, boatStatus, boatText, hitsLeftText) {
    //reset values first since it might swap players
    hitsLeftText.textContent = `( ${boat.myLength})`;
    boatStatus.classList.remove("boat-sunk");
    boatText.classList.remove("crossed-out");
    boatStatus.classList.remove("boat-hurt");

    hitsLeftText.textContent = `( ${boat.hitsLeft()})`;
    if (boat.hitsLeft() === 0) {
      boatStatus.classList.add("boat-sunk");
      boatText.classList.add("crossed-out");
    } else if (boat.numHits > 0) {
      boatStatus.classList.add("boat-hurt");
    }
  }
}
// console.log(domReference);
const GM = new GameManager();
