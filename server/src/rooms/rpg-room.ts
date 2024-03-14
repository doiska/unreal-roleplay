import { Room, Client } from "@colyseus/core";
import { Message, RPGRoomState } from "./schema/rpg-room-state";
import { tryParsingDice } from "../lib/dices";
import { Dispatcher } from "@colyseus/command";
import { OnPlayerJoin, OnPlayerLeave } from "../events/on-player-join";
import { commands } from "../commands";

export class RpgRoom extends Room<RPGRoomState> {
    public maxClients = 8;
    public dispatcher = new Dispatcher(this);

    onCreate() {
        this.setState(new RPGRoomState());

        this.onMessage("message", (client, message) => {
            const player = this.state.players.get(client.sessionId);

            this.state.messages.push(new Message({
                user: player.name,
                content: message,
                createdAt: Date.now()
            }));

            console.log("Sent message:", message);
        });

        this.onMessage<string>(
            "command",
            (client, message) => {
                const args = message.split(" ");

                const command = {
                    command: args[0].slice(1).toLowerCase(),
                    content: args.slice(1).join(" ")
                };

                console.log("Received command:", command)

                const CommandClass = commands.get(command.command);

                if (CommandClass) {
                    this.dispatcher.dispatch(new CommandClass(), { sessionId: client.sessionId, command: command.command, content: command.content });
                }
            }
        );
    }

    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!");
        this.dispatcher.dispatch(new OnPlayerJoin(), { sessionId: client.sessionId });
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        this.dispatcher.dispatch(new OnPlayerLeave(), { sessionId: client.sessionId });
    }

    onDispose() {
        this.dispatcher.stop();
    }
}
