import {
  Schema,
  type
} from "@colyseus/schema";

export class Position extends Schema {
  @type("number")
  public dimension: number = 0;

  @type("number")
  public x: number = 0;

  @type("number")
  public y: number = 0;

  constructor(x: number, y: number, dimension = 0) {
    super();
    this.x = x;
    this.y = y;
    this.dimension = dimension;
  }
}
