import type { IncomingMessage, ServerResponse } from "http";
import { productService } from "../service/product-service";

const productController = (req : IncomingMessage, res : ServerResponse) => {

    // product -> GET , POST, PUT

    const url = req.url;
    const method = req.method;

    if (url === "/products" && method === "GET") {

        const products = productService();

        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({
            message : "Product retrieve successfully",
            data : products,
        }));
    };

};


export default productController;