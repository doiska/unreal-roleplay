import { Schema, type } from "@colyseus/schema";

export class Player extends Schema {
    @type("string")
    public name: string = "Unnamed Player"

    constructor(
        { name }: { name: string }
    ) {
        super();

        this.name = name;
    }
}
