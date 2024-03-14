import { Command } from "@colyseus/command";
import { tryParsingDice } from "../lib/dices";
import { Message, RPGRoom } from "../rooms/schema/rpg-room-state";

function parseDiceGroup(content: string) {
    const diceGroupRegex = /(\d+)#(\S+)/g;

    return content.replaceAll(diceGroupRegex, (_, times, dice) => {
        const dices = Array.from({ length: Number(times) }, () => dice).join(',');
        return `{${dices}}`;
    });
}

const rules = [parseDiceGroup];

function applyRules(content: string) {
    return rules.reduce((acc, rule) => rule(acc), content);
}

export class RollDiceCommand extends Command<RPGRoom, { sessionId: string; command: string, content: string }> {
    execute({ command, content: unsafeContent, sessionId} = this.payload) {
        const content = applyRules(unsafeContent);
        const result = tryParsingDice(content);
        const player = this.state.players.get(sessionId);

        console.log(`RollDiceCommand: ${command} ${unsafeContent} => ${content} => ${result}`)

        if(!player || !result) {
            return;
        }

        this.state.messages.push(new Message({
            user: "System",
            content: `${player.name} rolled: ${result}`,
            timestamp: Date.now()
        }));
    }
}
