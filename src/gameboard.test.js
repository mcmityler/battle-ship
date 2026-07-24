import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new Gameboard();
test("try to place a ship in a spot that goes off board, should throw off board error", () => {
  expect(() => gameboard.placeShip(new Ship(3), [10, 10])).toThrow(
    "Coordinates off board",
  );
});
