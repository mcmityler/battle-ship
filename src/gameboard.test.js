import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

const gameboard = new Gameboard();
describe("Place Ship Component", () => {
  test("try to place a ship in a spot that goes off board, should throw off board error", () => {
    expect(gameboard.placeShip(new Ship(3), [9, 9])).toBe("off-board");
  });
  test("try to place a ship in a spot that goes off board with new direction, should throw off board error", () => {
    const myShip = new Ship(3);
    myShip.setDirection([0, 1]);
    expect(gameboard.placeShip(myShip, [9, 9])).toBe("off-board");
  });
  test("try to place a ship, should return 'placed'", () => {
    const myShip = new Ship(3);
    expect(gameboard.placeShip(myShip, [0, 0])).toBe("placed");
  });
  test("try to place a ship where a ship already is, should return 'occupied'", () => {
    const myShip = new Ship(3);
    expect(gameboard.placeShip(myShip, [0, 0])).toBe("occupied");
  });
});
describe("Place Ship Component", () => {
  test("try to attack a spot off the board, should throw off board error", () => {
    expect(gameboard.receiveAttack([10, 10])).toBe("off-board");
  });
  test("try to attack a spot with a ship on the board, should return 'hit'", () => {
    expect(gameboard.receiveAttack([0, 0])).toBe("hit");
  });
  test("try to attack a spot without a ship on the board, should return 'miss'", () => {
    expect(gameboard.receiveAttack([8, 0])).toBe("miss");
  });
});
