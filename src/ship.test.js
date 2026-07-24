import { Ship } from "./ship.js";
const ship = new Ship(3);
const sunkShip = new Ship(3);
test("check sunk should return false", () => {
  expect(ship.checkSunk()).toBe(false);
});
test("hit ship 3 times which should sink it and return true", () => {
  sunkShip.hit();
  sunkShip.hit();
  sunkShip.hit();
  expect(sunkShip.checkSunk()).toBe(true);
});
