import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new Gameboard();
describe("Place Ship Component", () => {
  test("try to place a ship in a spot that goes off board, should throw off board error", () => {
    expect(() => gameboard.placeShip(new Ship(3), [9, 9])).toThrow(
      "Coordinates off board",
    );
  });
  test("try to place a ship in a spot that goes off board with new direction, should throw off board error", () => {
    const myShip = new Ship(3);
    myShip.setDirection([0, 1]);
    expect(() => gameboard.placeShip(myShip, [9, 9])).toThrow(
      "Coordinates off board",
    );
  });
});
test("try to attack a spot off the board, should throw off board error", () => {
  expect(() => gameboard.receiveAttack([10, 10])).toThrow(
    "Coordinates off board",
  );
});
