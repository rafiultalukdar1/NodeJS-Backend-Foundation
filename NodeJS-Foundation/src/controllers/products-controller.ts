import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product-service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";

const productController = async (req : IncomingMessage, res : ServerResponse) => {

    // product -> GET , POST, PUT

    const url = req.url;
    const method = req.method;
    // console.log(url);  -> /products/1 -> []

    const urlParams = url?.split('/');
    // console.log(urlParams);
    const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

    // Get All Products
    if (url === "/products" && method === "GET") {

        const products = productService();

        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({
            message : "Product retrieve successfully",
            data : products,
        }));
    }
    else if (method === "GET" && id !== null) {
        const products = productService();
        const product = products.find((p : IProduct) => p.id === id);
        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({
            message : "Product retrieve successfully",
            data : product,
        }));
    }
    // Product Create (Post method)
    else if (method === "POST" && url === "/products") {

        const body = await bodyParser(req);
        // console.log(body);

        const newProduct = {
            id : Date.now(),
            ...body
        }
        
        const products = productService();

        products.push(newProduct);

        createProduct(products);

        res.writeHead(201,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({
            message : "Product created successfully",
            data : newProduct,
        }));
    }
    // Product Update (PUT method)
    else if (method === "PUT" && id !== null) {

        const body = await bodyParser(req);

        const products = productService();

        const index = products.findIndex((p : IProduct) => p.id === id);

        if (index < 0) {
            res.writeHead(404,{"Content-Type" : "application/json"});
            res.end(JSON.stringify({
                message : "Product not found!",
            }));
            return;
        }

        products[index] = {
            id : products[index].id,
            ...body
        }

        createProduct(products);

        res.writeHead(200,{"Content-Type" : "application/json"});
        res.end(JSON.stringify({
            message : "Product updated successfully",
            data : products[index],
        }));
    }
};

export default productController;