import type { IncomingMessage, ServerResponse } from "http";

const productController = (req : IncomingMessage, res : ServerResponse) => {

    // product -> GET , POST, PUT
    res.writeHead(200,{"Content-Type" : "application/json"});
    res.end(JSON.stringify({massage : "This is products route"}));

};


export default productController;