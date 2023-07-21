import { Router } from "express";
import { ProductManager } from '../dao/managers/products.manager.js';
import { CartManager } from '../dao/managers/carts.manager.js';
const router = Router();

const publicAccess = (req, res, next) => {
    if (req.session.user) return res.redirect('/products');
    next();
}
const privateAccess = (req, res, next) => {
    if (!req.session.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    res.render('register', {title: 'Bienvenido nuevo cliente', style: 'login.css'});
})

router.get('/login', publicAccess, (req, res) => {
    res.render('login', {title: 'Hola cliente', style: 'login.css'});
})

router.get('/resetpassword', publicAccess, (req, res) => {
    res.render('resetPassword', {title: 'Recuperar contraseña', style: 'login.css'});
})

router.get('/', privateAccess, (req, res) => {
    res.render('userProfile', {title: 'Mi perfil', style: 'login.css', user: req.session.user});
})

router.get('/staticProducts', privateAccess, async (req,res)=>{
    const productManager = new ProductManager();
    const products = await productManager.getProducts();
    res.render('home', {title: 'Productos', style: 'product.css', products: products});
})

router.get('/realtimeproducts', privateAccess, (req,res)=>{
    res.render('realTimeProducts', {title: 'Productos', style: 'productList.css'});
})

router.get('/webchat', (req,res)=>{
    res.render('chat', { style: 'chat.css', title: 'Nuestro ChatBox'});
})

router.get('/products', privateAccess, async (req,res)=>{
    try {
        const { limit = 10, page = 1, sort, category, available } = req.query;
        // Get baseUrl for navigation links
        const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
        const productManager = new ProductManager();
        const products = await productManager.getProducts(limit, page, sort, category, available, baseUrl);
        res.render('productList', {title: 'Productos', style: 'productList.css', products: products, user: req.session.user});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/carts/:cartId', privateAccess, async (req,res)=>{
    try {
        const cartId = req.params.cartId;
        const cartManager = new CartManager();
        const cart = await cartManager.getCart(cartId);
        res.render('cart', {title: 'Carrito de compras', style: 'cart.css', cart: cart});
    } catch (error) {
        res.status(500).send(error.message);
    }
})

export default router;