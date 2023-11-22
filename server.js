import http from "http";

const port = process.env.PORT || 3000;

const server = http.createServer(); //to re-create a server we need to pass a listener, a fn that executes on every req and turns it into a res
