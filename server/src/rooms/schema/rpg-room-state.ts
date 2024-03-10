import { Schema, MapSchema, ArraySchema, type } from "@colyseus/schema";
import { Room } from "@colyseus/core";
import { Player } from "../../entities/player";

class Attachment extends Schema {
    @type("string") url: string;
    @type("string") type: string;
}

export class Message extends Schema {
    @type("string") user: string;
    @type("string") content: string;
    @type("number") timestamp: number;
    @type("string") type: 'message' | 'song' | 'dice' | 'image' | 'video' | 'file' | 'map' | 'character' | 'npc' | 'monster' | 'item' | 'spell' | 'ability' | 'class';
    @type([Attachment]) attachment?: ArraySchema<Attachment>;
}

export class Song extends Schema {
    @type("string") url: string;
    @type("boolean") playing: boolean;
    @type("number") duration: number;
    @type("number") updatedAt: number;
}

export class RPGRoomState extends Schema {
    @type("string")
    name: string = "Unnamed Room";
    @type("number")
    maxPlayers: number = 8;

    @type([Message])
    messages = new ArraySchema<Message>();

    @type({ map: Player })
    players = new MapSchema<Player>();

    @type({ map: Song })
    songs = new MapSchema<Song>();
}

export type RPGRoom = Room<RPGRoomState>;