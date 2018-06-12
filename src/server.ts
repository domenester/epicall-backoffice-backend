import * as express from "express";
import * as http from "http";

class Server {

    public app: express.Application;

    private server: http.Server;

    private port: number = 3000;

    constructor() {
        this.app = express();
    }

    public start(callback?: () => void): void {
        this.server = this.app.listen(3000, () => {
            console.log("Listening at port: " + this.port);
            if (callback) { callback(); }
        });
    }

    public stop(): void {
        this.server.close();
    }

    public getPort(): number {
      return this.port;
    }
}

export default new Server();
