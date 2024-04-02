import { Command } from "@colyseus/command";
import { RPGRoom } from "../rooms/schema/rpg-room-state";

export class SetStats extends Command<RPGRoom, {
  sessionId: string,
  command: string,
  content: string[]
}> {
  execute({ sessionId, content } = this.payload) {
    const [action, tokenTargetId, attribute, value] = content;

    if (action !== "set") {
      return;
    }

    if (!["health", "speed", "stamina"].includes(attribute)) {
      return;
    }

    const target = this.state.tokens.get(tokenTargetId);
    const player = this.state.players.get(sessionId);

    if (!target || !player) {
      return;
    }

    if (player.role !== "master" && player.token.id !== tokenTargetId) {
      return;
    }

    switch (attribute) {
      case "health":
        target.health = this.parseValue(target.health, value);
    }
  }

  private parseValue(oldValue: number, value: string) {
    if (value.startsWith("+") || value.startsWith("-")) {
      const newValue = Number.parseInt(value);
      return oldValue + newValue;
    }

    return Number.parseInt(value);
  }
}
