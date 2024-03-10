import YTDlpWrap from "yt-dlp-wrap";

export const ytdl = new YTDlpWrap("./yt-dlp");

export function getAudioInfo(link: string) {
    return ytdl.getVideoInfo([
        link,
        "--skip-download",
        "--format",
        "bestaudio",
        "--audio-format",
        "mp3",
    ]);
}
