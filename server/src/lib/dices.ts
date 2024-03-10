import { DiceRoll } from "@dice-roller/rpg-dice-roller";

export function tryParsingDice(str: string) {
    try {
        const roll = new DiceRoll(str.trim());
        return roll.output;
    } catch (e) {
        console.error(e);
    }
}
