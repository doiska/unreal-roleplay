import { Command } from "@colyseus/command";
import { Message, Song, RPGRoom } from "../rooms/schema/rpg-room-state";
import { ytdl } from "../lib/ytdlp";

export class PlaySongCommand extends Command<RPGRoom, { sessionId: string; command: string, content: string }> {
    public async execute({ content: unsafeContent, sessionId} = this.payload) {
        const player = this.state.players.get(sessionId);

        const message = new Message({
            user: player.name,
            content: JSON.stringify({
                "type": "doc",
                "content": [{
                    "type": "paragraph",
                    "content": [{ "type": "text", "text": `Playing song: ${unsafeContent}`}]
                }]
            }),
            type: "song"
        });

        this.state.messages.push(message);

        const metadata = await ytdl.getVideoInfo(unsafeContent);
        const randomId = Math.random().toString(36).substring(7);

        console.log(metadata);

        this.state.songs.set(randomId, new Song({
            url: unsafeContent,
            playing: true,
            duration: metadata.duration,
            updatedAt: Date.now()
        }));
    }
}

export class PauseSongCommand extends Command<RPGRoom, { sessionId: string; command: string, content: string }> {
    public execute({ sessionId } = this.payload) {
        const player = this.state.players.get(sessionId);

        const message = new Message({
            user: player.name,
            content: `Pausing song.`,
            type: "song"
        });

        this.state.messages.push(message);

        for (const song of this.state.songs.values()) {
            song.playing = false;
        }
    }
}
