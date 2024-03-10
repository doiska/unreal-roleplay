import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";
import { Player } from "../entities/player";

export class OnPlayerJoin extends Command<RPGRoom, { sessionId: string }> {
    execute({ sessionId } = this.payload) {
        console.log(sessionId, "joined!");

        this.state.players.set(sessionId, new Player({ name: `Player ${this.state.players.size + 1}` }));
    }
}
