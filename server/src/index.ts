import { Server } from "colyseus";
import express from "express";
import { RpgRoom } from "./rooms/rpg-room";
import { WebSocketTransport } from "@colyseus/ws-transport";
import * as http from "http";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { handleAudioRequest } from "./http/audio";

const port = 2567;

export const app = express();

app.use(express.json());
app.use("/colyseus", monitor());
app.use("/audio/:link", handleAudioRequest);

if (process.env.NODE_ENV !== "production") {
    app.use("/", playground);
}

const gameServer = new Server({
    greet: false
});

gameServer.attach({
    transport: new WebSocketTransport({
        server: http.createServer(app),
    })
});

gameServer.define("rpg-room", RpgRoom);
gameServer.listen(2567);

console.log(`Listening on ws://localhost:${port}`)
