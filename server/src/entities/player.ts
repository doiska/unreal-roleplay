import { Schema, type } from "@colyseus/schema";

interface IPlayer {
    name: string;
    role: "user" | "master";
}

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

export class Player extends Schema implements IPlayer {
    @type("string")
    public name: string = "Unnamed Player"

    @type("string")
    public role: "user" | "master" = "user"

    @type(Position)
    public position: Position = new Position(0, 0);

    constructor(player: IPlayer) {
        super();

        this.name = player.name;
        this.role = player.role;
    }
}
