import type { IncomingMessage, ServerResponse } from "http";
import { createProduct, productService } from "../service/product-service";
import type { IProduct } from "../types/product";
import { bodyParser } from "../utils/parseBody";
import { sendResponse } from "../utils/sendResponse";

const productController = async (req : IncomingMessage, res : ServerResponse) => {

    // product -> GET , POST, PUT
    const url = req.url;
    const method = req.method;
    const urlParams = url?.split('/');
    const id = urlParams && urlParams[1] === "products" ? Number(urlParams[2]) : null;

    // Get All Products
    if (url === "/products" && method === "GET") {
        try {
            const products = productService();
            sendResponse(res, true, 200, "Products retrieve successfully", products);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error");
        }
    }
    // Get a single product by ID
    else if (method === "GET" && id !== null) {
        try {
            const products = productService();
            const product = products.find((p : IProduct) => p.id === id);
            if (!product) {
                sendResponse(res, false, 404, "Product not found");
                return;
            }
            sendResponse(res, true, 200, "Product retrieve successfully", product);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error");
        }        
    }
    // Product Create (Post method)
    else if (method === "POST" && url === "/products") {
        try {
            const body = await bodyParser(req);
            const newProduct = {
                id : Date.now(),
                ...body
            };
            const products = productService();
            products.push(newProduct);
            createProduct(products);
            sendResponse(res, true, 201, "Product created successfully", newProduct);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error");
        }
    }
    // Product Update (PUT method)
    else if (method === "PUT" && id !== null) {
        try {
            const body = await bodyParser(req);
            const products = productService();
            const index = products.findIndex((p : IProduct) => p.id === id);
            if (index < 0) {
                sendResponse(res, false, 404, "Product not found!");
                return;
            }
            products[index] = {
                id : products[index].id,
                ...body
            }
            createProduct(products);
            sendResponse(res, true, 200, "Product updated successfully", products[index]);
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error");
        }
    }
    // Executing DELETE Method Operations
    else if (method === "DELETE" && id !== null) {
        try {
            const products = productService();
            const index = products.findIndex((p : IProduct) => p.id === id);
            if (index < 0) {
                sendResponse(res, false, 404, "Product not found!");
                return;
            }
            products.splice(index,1);
            createProduct(products);
            sendResponse(res, true, 200, "Product deleted successfully");
        } catch (error) {
            sendResponse(res, false, 500, "Internal server error");
        }
    }
};

export default productController;