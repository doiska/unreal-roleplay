import { Schema, type } from "@colyseus/schema";
import { TokenEntity } from "./token";

interface IPlayer {
    name: string;
    role: "player" | "master";
    token: TokenEntity;
}

export class Player extends Schema implements IPlayer {
    @type("string")
    public name: string = "Unnamed Player"

    @type("string")
    public role: "player" | "master" = "player";

    @type("string")
    public map: string = "https://i.pinimg.com/originals/8f/a9/21/8fa921d8a63955010c4371d247b881ab.png";

    @type(TokenEntity)
    public token: TokenEntity = new TokenEntity();

    constructor(player: IPlayer) {
        super();

        this.name = player.name;
        this.role = player.role;
        this.token = player.token;
    }
}
