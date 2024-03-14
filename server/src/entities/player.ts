import { Schema, type } from "@colyseus/schema";

interface IPlayer {
    name: string;
    role: "user" | "master";
}

export class Player extends Schema implements IPlayer {
    @type("string")
    public name: string = "Unnamed Player"

    @type("string")
    public role: "user" | "master" = "user"

    constructor(player: IPlayer) {
        super();

        this.name = player.name;
        this.role = player.role;
    }
}
