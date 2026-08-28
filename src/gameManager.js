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
    this.gg = false;
    this.computerDifficulty = "easy";
    //references to DOM elements
    this.initDOMReferences();
  }
  initDOMReferences() {
    //new game dialog
    this.newGameDialog = document.getElementById("new-game-dialog");
    this.newGameDialog.showModal();
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

    this.gameOverDialog = document.getElementById("game-over-dialog");
    this.winnerText = document.querySelector(".winner-text");
    this.playAgainButton = document.querySelector(".play-again-button");
    this.playAgainButton.addEventListener("click", () => {
      //start a new game here
      this.gameOverDialog.close();
      this.newGameDialog.showModal();
    });

    this.errorText = document.querySelector(".error-text");
    this.easyDifficultySelector = document.getElementById("easy-difficulty");
    this.easyDifficultySelector.addEventListener("change", () =>
      this.changeComputerDifficulty(),
    );
    this.hardDifficultySelector = document.getElementById("hard-difficulty");
    this.hardDifficultySelector.addEventListener("change", () =>
      this.changeComputerDifficulty(),
    );
  }
  startGame(event) {
    // 1. Prevent the default browser page reload
    event.preventDefault();
    // 2. Instantiate FormData by passing the form element
    const formData = new FormData(event.target);

    this.resetGame();

    this.initPlayerNames(formData);
    this.updatePlayerTexts();

    this.initializeGridButtons();

    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2, //current player
      this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
    );

    //close inputs
    this.newGameDialog.close();

    this.startGameForm.reset(); //clear form inputs
  }
  resetGame() {
    this.player1 = new Player();
    this.player2 = new Player();
    this.playersTurn = 1;
    this.nextTurn = false; //is it the next persons turn
    this.computerThinking = false;
    this.player1Placed = false; //has the player confirmed the placement of their ships
    this.player2Placed = false; // ^
    this.randomizedClicked = false; // has the player randomized the board once
    //reset player shot history text content
    this.p1Shots.textContent = "";
    this.p2Shots.textContent = "";
    this.boatRandomizeContainer.classList.remove("hidden");
    this.gg = false;
  }
  initPlayerNames(formData) {
    //set player 1 name (default: Player 1)
    this.player1.playerName =
      formData.get("p1-input") == "" ? "Player 1" : formData.get("p1-input");
    //check if player 2 is a computer
    this.player2.isComputer = formData.has("computer-input");
    //check if player 2 has a name (Default: Player 2 or Computer)
    if (this.player2.isComputer === false) {
      if (formData.get("p2-input") == "") {
        this.player2.playerName = "Player 2";
      } else {
        this.player2.playerName = formData.get("p2-input");
      }
    } else {
      this.player2.playerName = "Computer";
    }
  }
  changeComputerDifficulty() {
    this.computerDifficulty === "easy"
      ? (this.computerDifficulty = "hard")
      : (this.computerDifficulty = "easy");

    //ONLY NEEDED UNTIL HARD DIFFICULTY IS SET UP
    console.log(this.computerDifficulty);
    this.errorText.classList.add("hidden"); //hide error
    if (this.computerDifficulty === "hard") {
      this.errorText.classList.remove("hidden"); //show error
    }
  }
  initializeGridButtons() {
    shipRowContainer.replaceChildren();
    shotRowContainer.replaceChildren();
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
  updatePlayerTexts() {
    let currentPlayer = this.playersTurn === 1 ? this.player1 : this.player2;
    this.currentTurnTextbox.classList.remove("p2-color");
    this.currentTurnTextbox.classList.remove("p1-color");

    if (this.playersTurn === 1) {
      this.currentTurnTextbox.classList.add("p1-color");
    } else if (this.playersTurn === 2) {
      currentPlayer = this.player2;
      this.currentTurnTextbox.classList.add("p2-color");
    }
    this.randomizerName.textContent = currentPlayer.playerName;
    this.currentTurnTextbox.textContent = `${currentPlayer.playerName}`;

    if (this.player2.isComputer === false || this.playersTurn === 1) {
      playerShipsText.textContent = `${currentPlayer.playerName}'s Ships`;
      playerShotsText.textContent = `${currentPlayer.playerName}'s Shots`;
    }

    this.passText.textContent = `Pass to ${currentPlayer.playerName}`;
  }
  updateHitList(y, x) {
    if (this.playersTurn === 1) {
      this.p1Shots.textContent += ` [${+x + 1},${+y + 1}]`;
    } else {
      this.p2Shots.textContent += ` [${+x + 1},${+y + 1}]`;
    }
  }
  gridcellClick(myID) {
    //click cell on game board - dissect ID into info of where was clicked
    const [y, x, type] = myID.split(" "); // y = 0-9, x = 0-9, type = shot or ship
    console.log(`(Y:${y},X:${x}) - ${type}` + " cell clicked");

    //computers turn skip click
    if (this.computerThinking === true) return;
    if (this.gg === true) return;
    //if y,x-ship
    if (type === "ship") {
      this.gridShipClick(y, x);
    }

    //haven't placed both ship sides yet so skip shoot
    if (this.player1Placed === false || this.player2Placed === false) return;

    //if y,x-shot
    if (type === "shot" && this.nextTurn === false) {
      this.gridShotClick(y, x);
    }
  }
  gridShipClick(y, x) {
    console.log("place a ship");
  }
  gridShotClick(y, x) {
    //result of shot -> repeat, miss, hit, sunk, sunkAll
    let shotResult = "";
    if (this.playersTurn === 1) {
      //if P1 turn attack P2 board and vice versa
      shotResult = this.player2.playerBoard.receiveAttack([y, x]);
    } else if (this.playersTurn === 2) {
      shotResult = this.player1.playerBoard.receiveAttack([y, x]);
    }
    if (shotResult === "repeat") return; //ensure you cant hit same spot twice and waste a turn

    this.updateHitList(y, x);

    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2,
      this.playersTurn === 1 ? this.player2 : this.player1,
    );
    if (shotResult === "sunkAll") {
      console.log("game over");
      this.gameOver();
      return;
    }
    if (this.player2.isComputer === false && this.gg === false) {
      this.showChangeTurns(); //show change turns section if pvp
    } else if (this.player2.isComputer === true && this.gg === false) {
      //Make a computer move here if Player vs CPU
      this.startComputerMove();
    }
  }
  showChangeTurns() {
    this.changeTurnContainer.classList.add("open-container");
    //timeout so that it expands fully before button appears
    setTimeout(() => this.changeTurnButton.classList.remove("hidden"), 200);
    this.nextTurn = true;
  }
  startComputerMove() {
    this.changeTurns();
    this.greyOut();
    this.currentTurnTextbox.textContent = `Computer`;
    //timeout to make it feel like the computer is doing something
    this.computerThinking = true;
    setTimeout(() => this.computerHit(), 400);
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
    let shotResult;
    while (hit === false) {
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      shotResult = this.player1.playerBoard.receiveAttack([y, x]);
      console.log("computer hit");
      if (
        shotResult === "miss" ||
        shotResult === "hit" ||
        shotResult === "sunk"
      ) {
        hit = true;
        this.updateHitList(y, x);
      }
      if (shotResult === "sunkAll") {
        this.displayBoard(this.player1, this.player2);
        this.gameOver();
        this.updateHitList(y, x);
        return;
      }
    }
    //show CPU shot on Player 1 board
    this.displayBoard(this.player1, this.player2);

    this.changeTurns();

    //done making a move, user can now strike
    this.computerThinking = false;
  }
  changeTurns(changeTurnButton = false) {
    this.playersTurn === 1 ? (this.playersTurn = 2) : (this.playersTurn = 1);
    console.log("CHANGE TURN" + this.playersTurn);

    if (changeTurnButton === true) {
      //open click to continue and clear the boards
      this.clickDialog.showModal();
      //hide the board until click to continue
      this.cleanBoard();
    }
    this.updatePlayerTexts();

    this.nextTurn = false;
    this.changeTurnContainer.classList.remove("open-container");
    this.changeTurnButton.classList.add("hidden");
  }
  clickToContinue() {
    this.clickDialog.close();

    //display the players ships and shots
    this.displayBoard(
      this.playersTurn === 1 ? this.player1 : this.player2, //current player
      this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
    );
  }
  cleanBoard() {
    //hides all board cell values between turns when playing PVP (to hide ship placement)
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        this.shipBoard[y][x].classList = "game-button";
        this.shotBoard[y][x].classList = "game-button";
      }
    }
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
      //if they only click confirm and didnt randomize first then do it for them automatically
      this.randomizeBoard(this.playersTurn === 1 ? this.player1 : this.player2);
      this.displayBoard(
        this.playersTurn === 1 ? this.player1 : this.player2, //current player
        this.playersTurn === 1 ? this.player2 : this.player1, //opponent player
      );
    }

    this.randomizedClicked = false;

    if (this.playersTurn === 1) {
      this.player1Placed = true;
    } else if (this.playersTurn === 2) {
      this.player2Placed = true;
    }

    if (this.player2.isComputer === true) {
      this.changeTurns();
    } else if (this.player2.isComputer === false || this.playersTurn === 1) {
      this.changeTurns(true);
    }

    //on cpu vs player
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
  displayBoard(currentPlayer, opponentPlayer) {
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
  gameOver() {
    this.gameOverDialog.showModal();
    this.gg = true;
    this.winnerText.textContent = `${
      this.playersTurn === 1 ? this.player1.playerName : this.player2.playerName
    } wins!`;
  }
}

const GM = new GameManager();

/* TO DO LIST
  - Hard mode CPU (goes diagonals until finds a ship and then it does around it until 
    it sinks that ship.. if it finds another ship add location to the list and after it 
    sinks the first one try sinking the next in the list)
  - Drag and drop to place ships instead of randomizing if I want to get fancy.
  - Legend what hit miss and your ships mean in ship / shot board section
   (could be top right of asd ships section)
  - Space or Enter Click to continue game on PVP
*/
