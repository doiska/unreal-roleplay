import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";

export class TokenCreateCommand extends Command<RPGRoom, { command: string, content: string[] }> {
  execute() {
    console.log("TokenCreateCommand");
  }
}
