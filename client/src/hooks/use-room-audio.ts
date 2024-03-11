import { useColyseusState } from "@/colyseus";
import { useEffect } from "react";
import { useMusicPlayer } from "./music-player.ts";

export function useRoomAudio() {
    const syncQueue = useColyseusState(state => state.songs);
    const playerQueue = useMusicPlayer();

    useEffect(() => {
        console.log(syncQueue)

        if (!syncQueue) {
            playerQueue.clearTracks();
            return;
        }

        for (const song of playerQueue.tracks) {
            if (!syncQueue.has(song.info.id)) {
                playerQueue.removeTrack(song.info.id);
            }
        }

        for (const [id, song] of syncQueue) {
            const track = playerQueue.tracks.find(({ info }) => info.id === id);

            if (track) {
                if (song.playing) {
                    playerQueue.playTrack(id);
                    continue;
                }
                playerQueue.pauseTrack(id);
                continue;
            }

            const seek = Date.now() - song.updatedAt;

            playerQueue.addTrack({
                id,
                url: song.url,
                seek: seek / 1000,
            });

            if (song.playing) {
                playerQueue.playTrack(id);
            }
        }
    }, [syncQueue]);
}
