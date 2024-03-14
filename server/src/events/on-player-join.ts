import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";
import { Player } from "../entities/player";

export class OnPlayerJoin extends Command<RPGRoom, { sessionId: string }> {
    execute({ sessionId } = this.payload) {
        this.state.players.set(sessionId, new Player({ name: "Unnamed Player", role: "user" }));
    }
}

export class OnPlayerLeave extends Command<RPGRoom, { sessionId: string }> {
    execute({ sessionId } = this.payload) {
        this.state.players.delete(sessionId);
    }
}

