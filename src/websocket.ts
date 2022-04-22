import WS from "ws";

export default class WebSocketClass {
    public ws = new WS("wss://gateway.discord.gg/?v=6&encoding=json");
}
