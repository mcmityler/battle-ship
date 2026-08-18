import { Ship } from "../ship.js";
const ship = new Ship(3);
const sunkShip = new Ship(3);

describe("Check if ships can be sunk & if hitting them works", () => {
  test("check sunk should return false", () => {
    expect(ship.checkSunk()).toBe(false);
  });
  test("hit ship 1 time should return 1", () => {
    expect(sunkShip.hit()).toBe(1);
  });
  test("hit ship 3 times which should sink it and return true", () => {
    sunkShip.hit();
    sunkShip.hit();
    expect(sunkShip.checkSunk()).toBe(true);
  });
});
test("change the direction the ship is facing to (0,-1)", () => {
  //to equal since its an array
  ship.setDirection([0, -1]);
  expect(ship.direction).toEqual([0, -1]);
});

test("change the name of the ship to 'happy'", () => {
  //to equal since its an array
  ship.setName("happy");
  expect(ship.getName()).toBe("happy");
});

test("set the ship to be placed", () => {
  //to equal since its an array
  ship.place();
  expect(ship.isPlaced).toBe(true);
});
