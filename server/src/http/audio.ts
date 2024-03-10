import { Request, Response } from "express";
import YTDlpWrap from "yt-dlp-wrap";
import { getAudioInfo, ytdl } from "../lib/ytdlp";


export async function handleAudioRequest(
    req: Request<{ link: string }>,
    res: Response
) {
    const { link } = req.params;

    const audio = ytdl.execStream([
        link,
        "-x",
        "--audio-format",
        "mp3",
        "--audio-quality",
        "0",
        "-o",
        "-"
    ]);

    const info = await getAudioInfo(link);

    res.writeHead(200, {
        "Content-Type": "audio/mp3",
        "Content-Length": info.downloader_options.http_chunk_size,
        "Accept-Ranges": "bytes",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
    })

    audio.pipe(res);

    audio.on("end", () => {
        console.log("end");
        res.end();
    });

    audio.on("error", (err) => {
        console.error(err);
        res.status(500).end();
    });

    res.on("close", () => audio.destroy());
}
