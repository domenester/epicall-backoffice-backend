import * as express from "express";
import * as http from "http";
import {serverConfig} from "./config/server";

class Server {

    public app: express.Application;

    private server: http.Server;

    private port: number = serverConfig.port;

    constructor() {
        this.app = express();
    }

    public start(callback?: () => void): void {
        this.server = this.app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log("Listening at port: " + this.port);
            if (callback) { callback(); }
        });
    }
}

export default new Server();
