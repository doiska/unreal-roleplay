import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";
import { Player } from "../entities/player";
import { TokenEntity } from "../entities/token";

export class OnPlayerJoin extends Command<RPGRoom, { sessionId: string, options: any }> {
    execute({ sessionId, options } = this.payload) {
        const token = new TokenEntity();
        token.name = `Player ${sessionId}`;

        this.state.tokens.set(token.id, token);
        this.state.players.set(sessionId, new Player({ name: "Unnamed Player", role: options.role, token }));
    }
}

export class OnPlayerLeave extends Command<RPGRoom, { sessionId: string }> {
    execute({ sessionId } = this.payload) {
        this.state.players.delete(sessionId);
    }
}
