import { createServer, IncomingMessage, Server, ServerResponse } from "http";


const server : Server = createServer((req : IncomingMessage, res : ServerResponse) => {
    // console.log("Request: ", req);
    // console.log("Response: ", res);
    // console.log(req.url);
    // console.log(req.method);
    const url = req.url;
    const method = req.method;

    if (url === "/" && method === "GET") {
        // console.log("This is root route");
        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({massage : "This is root route"}));
    }
    else if (url?.startsWith("/products")) {
        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({massage : "This is products route"}));
    }
    else {
        // console.log("This route is not define");
        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({ massage : "This route is not define" }));
    }
});

server.listen(5000, () => {
    console.log("Server is running successfully!!");
});