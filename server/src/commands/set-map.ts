import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";

export class SetMapCommand extends Command<RPGRoom, { command: string, content: string[] }> {
  execute({ content } = this.payload) {
    const [action] = content;

    if(action !== "set") {
      return;
    }

    const [, target, image] = content;

    if(target === '-1') {
      for (const player of this.state.players.values()) {
        player.map = image;
      }
      return;
    }

    const player = this.state.players.get(target);

    if(player) {
      player.map = image;
    }
  }
}
