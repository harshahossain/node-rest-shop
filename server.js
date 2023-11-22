const http = require("http");
// import { app } from "./app.js";
const app = require("./app");

const port = process.env.PORT || 3000;

const server = http.createServer(app); //to re-create a server we need to pass a listener, a fn that executes on every req and turns it into a res

server.listen(port, () => console.log(`Listenting at ${port}`));
