import { create } from "zustand";

interface Track {
    info: {
        id: string;
        url: string;
        title?: string;
        artist?: string;
        category?: string;
        seek?: number;
    };
    state: {
        playing: boolean;
        volume: number;
    };
    element: HTMLAudioElement;
}

interface MusicPlayerState {
    tracks: Track[];
    isTrackPlaying: (trackId: string) => boolean;

    addTrack: (track: Track['info']) => void;
    playTrack: (trackId: string) => void;
    pauseTrack: (trackId: string) => void;
    removeTrack: (trackId: string) => void;
    setVolume: (trackId: string, volume: number) => void;
    clearTracks: () => void;
}

export const useMusicPlayer = create<MusicPlayerState>()((set, get) => ({
    tracks: [],
    isTrackPlaying: (trackId: string) => {
        const track = get().tracks.find(({ info }) => info.id === trackId);
        return track ? track.state.playing : false;
    },
    addTrack: (track) => {
        set(state => {
            const audioElement = new Audio();
            audioElement.crossOrigin = 'anonymous';
            audioElement.src = `http://localhost:2567/audio/${track.url}`;

            const handleCanPlay = () => {
                audioElement.currentTime = track.seek || 0;
                audioElement.removeEventListener('canplay', handleCanPlay);
            }

            audioElement.addEventListener('canplay', handleCanPlay);
            audioElement.addEventListener('ended', () => get().removeTrack(track.id));

            audioElement.load();

            return {
                tracks: [
                    ...state.tracks,
                    {
                        info: track,
                        state: { playing: false, volume: 100 },
                        element: audioElement
                    }
                ]
            }
        })
    },
    playTrack: (trackId: string) => {
        set(state => {
            return {
                tracks: state.tracks.map(track => {
                    if (track.info.id !== trackId) {
                        return track;
                    }

                    const { element, state } = track;
                    element.play();

                    return { ...track, state: { ...state, playing: true } };
                })
            }
        });
    },
    pauseTrack: (trackId: string) => {
        set(state => {
            return {
                tracks: state.tracks.map(track => {
                    if (track.info.id !== trackId) {
                        return track;
                    }

                    const { element, state } = track;
                    element.pause();

                    return { ...track, state: { ...state, playing: false } };
                })
            }
        });
    },
    removeTrack: (trackId: string) => {
        set(state => {
            const track = state.tracks.find(({ info }) => info.id === trackId);

            if (track) {
                track.element.remove();
            }

            return {
                tracks: state.tracks.filter(({ info }) => info.id !== trackId)
            }
        });
    },
    clearTracks: () => {
        set(state => {
            for (const track of state.tracks) {
                track.element.remove();
            }

            return { tracks: [] };
        });
    },
    setVolume: (trackId: string, volume: number) => {
        set(state => {
            return {
                tracks: state.tracks.map(track => {
                    if (track.info.id !== trackId) {
                        return track;
                    }

                    const { element } = track;
                    element.volume = volume / 100;

                    return {
                        ...track,
                        state: { ...track.state, volume }
                    }
                })
            }
        });
    }
}));
