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

export class OnPlayerMove extends Command<RPGRoom, { id: string, x: number, y: number }> {
    execute({ id, x, y } = this.payload) {
        const player = this.state.players.get(id);

        if (player) {
            player.position.x = x;
            player.position.y = y;
        }

        console.log("Player moved", id, x, y);
    }
}

