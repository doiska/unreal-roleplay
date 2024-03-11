import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Volume2, VolumeX } from "lucide-react";
import { useMusicPlayer } from "@/hooks/music-player.ts";

export function SongList() {
    const music = useMusicPlayer();

    const handleVolumeToggle = (id: string) => {
        const track = music.tracks.find(track => track.info.id === id);

        if(!track) {
            return;
        }

        if(track.state.volume > 0) {
            music.setVolume(id, 0);
        } else {
            music.setVolume(id, 100);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Songs</CardTitle>
                <CardDescription>Current songs in queue</CardDescription>
            </CardHeader>
            <CardContent>
                {!music.tracks && <p>No songs in queue</p>}
                {music.tracks.map(track => (
                    <Button variant="outline" className="flex gap-2 w-full justify-start" onClick={() => handleVolumeToggle(track.info.id)}>
                        {track.state.volume ? <Volume2 /> : <VolumeX />}
                        {track.info.title || track.info.url}
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}

