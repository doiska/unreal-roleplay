import {
  Schema,
  type
} from "@colyseus/schema";
import { Position } from "./position";

export class TokenEntity extends Schema {
  @type("string")
  public id: string = Math.random().toString(36).substring(2, 9);

  @type("string")
  public name: string = "Unnamed Token";

  @type("float64")
  public health: number = 100;

  // TODO: add attributes

  @type(Position)
  public position: Position = new Position(0, 0);

  @type("string")
  public image: string = "https://i.pinimg.com/originals/8f/a9/21/8fa921d8a63955010c4371d247b881ab.png";
}
