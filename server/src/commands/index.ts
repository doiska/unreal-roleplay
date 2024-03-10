import { RollDiceCommand } from "./roll";
import { Command } from "@colyseus/command";
import { PauseSongCommand, PlaySongCommand } from "./play";

export const commands = new Map<string, any>([
    ["roll", RollDiceCommand],
    ["play", PlaySongCommand],
    ["pause", PauseSongCommand]
]);
