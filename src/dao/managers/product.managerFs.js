import fs from 'fs';
import shortid from 'shortid';
class Product {
    constructor({ title, description, code, price, stock, category, thumbnails }) {  
        if (!title || !description || !code || !price || stock === null || category === undefined) throw new Error('All parameters should be specified');

        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof code !== 'string' ||
            (typeof price !== 'string' && typeof price !== 'number') ||
            (typeof stock !== 'string' && typeof stock !== 'number') ||
            typeof category !== 'string'
        ) {
            throw new Error('Tipo de datos de parámetro no válido');
        }

        let parsedPrice = price;

        if (typeof price === 'string') {
          parsedPrice = parseFloat(price);
          
          if (isNaN(parsedPrice)) {
            throw new Error('Tipo de datos de parámetro no válido');
          }
        }

        if (parsedPrice < 0) throw new Error('El precio no puede ser negativo');

        let parsedStock = stock;

        if (typeof stock === 'string') {
            parsedStock = parseInt(stock);
          
          if (isNaN(parsedStock)) {
            throw new Error('Tipo de datos de parámetro no válido');
          }
        }  

        if (parsedStock < 0) throw new Error('El stock no puede ser negativo');

        let thumbnailsArray = [];
        if (thumbnails) {
            if (typeof thumbnails === 'string') {
                thumbnailsArray = [thumbnails];
            } else if (Array.isArray(thumbnails)) {
                thumbnailsArray = thumbnails;
            } else {
                throw new Error('Los thumbnails deben ser string');
            }
        }

        this.id = shortid.generate();
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = parsedPrice;
        this.status = true;
        this.stock = parsedStock;
        this.category = category;
        this.thumbnails = thumbnailsArray;
    }
}

class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];
    }
    initialize = async () => {
        if(fs.existsSync(this.filePath)) {
            const data = await fs.promises.readFile(this.filePath, 'utf8');
            this.products = JSON.parse(data);
        } else {
            this.products = [];
        }
    }
    save = async () => {
        await fs.promises.writeFile(this.filePath, JSON.stringify(this.products, null, '\t'));
    }
    getProducts = async () => {
        await this.initialize()
        return this.products;
    }
    addProduct = async (newFields) => {
        await this.initialize();
        const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
        const invalidFields = Object.keys(newFields).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Nuevos campos no válidos: ${invalidFields.join(', ')}`);
        }
        const { title, description, code, price, stock, category, thumbnails } = newFields;
        if (code && this.products.some((product) => product.code === code)) throw new Error('El código especificado está en uso por otro producto existente');
        const newProduct = new Product({title, description, code, price, stock, category, thumbnails});
        this.products.push(newProduct);
        await this.save();
        return newProduct;
    }
    getProductById = async (productId) => {
        if (!shortid.isValid(productId)) throw new Error('ID del producto incorrecto');
        await this.initialize();
        const returnProduct = this.products.find((product) => product.id === productId);
        if(!returnProduct) throw new Error("Producto no encontrado");
        return returnProduct;
    }
    deleteProduct = async (productId) => {
        if (!shortid.isValid(productId)) throw new Error('ID del producto incorrecto');
        await this.initialize();
        const index = this.products.findIndex((product) => product.id === productId);
        if (index === -1) {
            throw new Error("Producto no encontrado");
        }
        this.products.splice(index, 1);
        await this.save();
    }
    updateProduct = async (productId, updatedFields) => {
        if (!shortid.isValid(productId)) throw new Error('ID del producto incorrecto');
        await this.initialize();
        const index = this.products.findIndex((product) => product.id === productId);
        if (index === -1) throw new Error("Producto no encontrado");

        const existingProduct = this.products[index];
        const updatedProduct = { ...existingProduct, ...updatedFields };

        const allowedFields = ['title', 'description', 'code', 'price', 'stock', 'category', 'thumbnails'];
        const invalidFields = Object.keys(updatedFields).filter(field => !allowedFields.includes(field));
        if (invalidFields.length > 0) {
            throw new Error(`Campos actualizables no válidos: ${invalidFields.join(', ')}`);
        }

        if (updatedProduct.price < 0) throw new Error('El precio no puede ser negativo');
        if (updatedProduct.stock < 0) throw new Error('El stock no puede ser negativo');
        if (updatedProduct.id !== productId) throw new Error('No se puede actualizar la identificación');        

        let thumbnailsArray = [];
        if (updatedProduct.thumbnails) {
            if (typeof updatedProduct.thumbnails === 'string') {
                thumbnailsArray = [updatedProduct.thumbnails];
            } else if (Array.isArray(updatedProduct.thumbnails)) {
                thumbnailsArray = updatedProduct.thumbnails;
            } else {
                throw new Error('Los thumbnails deben ser string');
            }
            updatedProduct.thumbnails = thumbnailsArray;
        }

        if (updatedFields.code && updatedFields.code !== existingProduct.code && this.products.some((product) => product.code === updatedProduct.code && product.id !== updatedProduct.id )) {
            throw new Error('El código especificado está en uso por otro producto existente');
        }
          
        this.products[index] = updatedProduct;
        await this.save();
        return this.products[index];
    }
};

export { ProductManager };