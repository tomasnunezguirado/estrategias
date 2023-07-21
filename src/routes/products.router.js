import { Router } from "express";
import { productsUpdated } from "../utils/socketUtils.js";
import { ProductManager } from "../dao/managers/products.manager.js";
import uploader from '../utils/multer.js';

const productManager = new ProductManager();

const router = Router();

router.get('/', async (req, res) => { 
    try {
        const { limit = 10, page = 1, sort, category, available } = req.query;
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const products = await productManager.getProducts(limit, page, sort, category, available, baseUrl);        
        res.send({status: 1, ...products});
    } catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await productManager.getProductById(productId)
        res.send({status: 1, product: product});
    } catch (error) {
        res.status(404).send({status: 0, msg: error.message});
    }
});

router.post('/', uploader.array('thumbnails'), async (req, res) => {
    try {
        const newProductFields = req.body;
        const files = req.files;
        const filesUrls = files.map(file => `http://localhost:8080/files/uploads/${file.filename}`);
        newProductFields.thumbnails = filesUrls;        
        const newProduct = await productManager.addProduct(newProductFields);
        productsUpdated(req.app.get('io'));
        res.send({status: 1, msg: 'Producto añadido con éxito', product: newProduct});
        } catch (error) {
        res.status(500).send({status: 0, msg: error.message});
    }
});

router.put('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const updatedProductFields= req.body;

        if (Object.keys(req.body).length === 0) throw new Error('Empty request body');
        const updatedProduct = await productManager.updateProduct(productId, updatedProductFields);
        productsUpdated(req.app.get('io'));
        res.send({status: 1, msg: 'Producto actualizado con éxito', product: updatedProduct});
    } catch (error) {
        res.status(404).send({status: 0, msg: error.message});
    }
});

router.delete('/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        await productManager.deleteProduct(productId);
        productsUpdated(req.app.get('io'));
        res.send({status: 1, msg: 'Producto eliminado con éxito'});
    } catch (error) {
        res.status(404).send({status: 0, msg: error.message});
    }
});

export default router;