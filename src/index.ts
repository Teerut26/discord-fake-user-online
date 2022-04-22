import { RawData } from "ws";
import { OPCode } from "./enums/OPCode";
import WebSocketClass from "./websocket";
require("dotenv").config()

export default class DiscordFakeOnline extends WebSocketClass {
    private sequence: number = 0;
    constructor() {
        super();
        this.events();
    }

    events() {
        this.ws.on("message", (data) => this.setup(data));
    }

    sendWs(op: OPCode, d: any) {
        this.ws.send(JSON.stringify({ op, d }));
    }

    setActivities() {
        this.sendWs(OPCode.PresenceUpdate, {
            since: 91879201,
            activities: [
                {
                    name: "Visual Studio Code",
                    type: 0,
                    application_id: "383226320970055681",
                    state: " 📂 Project",
                    details: "⚙️ index.ts | 25/1542 lines",
                    timestamps: {
                        start: 1635232192000,
                    },
                    assets: {
                        large_image: "808842276184784916",
                        large_text: "Editing a TYPESCRIPT file",
                        small_image: "565945770067623946",
                        small_text: "VS Code",
                    },
                },
            ],
            status: "online",
            afk: false,
        });
    }

    setup(message: RawData) {
        let data = JSON.parse(message.toString());
        console.log(data.t)
        if (data.s) this.sequence = data.s;
        switch (data.op) {
            case OPCode.HELLO:
                setInterval(
                    () => this.sendWs(OPCode.HEARTBEAT, this.sequence),
                    data.d.heartbeat_interval
                );
                this.sendWs(OPCode.IDENTIFY, {
                    token: process.env.TOKEN,
                    properties: {
                        $os: "Windows",
                        $browser: "Chrome",
                        $device: "",
                    },
                    compress: false,
                });
            this.setActivities();
        }
    }
}

new DiscordFakeOnline();
