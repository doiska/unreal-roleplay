import { RollDiceCommand } from "./roll";
import { Command } from "@colyseus/command";
import { PauseSongCommand, PlaySongCommand } from "./play";
import { SetMapCommand } from "./set-map";
import { SetStats } from "./set-stats";

export const commands = new Map<string, any>([
    ["roll", RollDiceCommand],
    ["play", PlaySongCommand],
    ["pause", PauseSongCommand],
    ["map", SetMapCommand],
    ["stats", SetStats]
]);
