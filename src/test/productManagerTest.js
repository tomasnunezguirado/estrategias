import { ProductManager } from "../managers/productManager.js";

const productManager = new ProductManager('./src/data/products.json');

const test = async () => {
    //Test Case 1: todos los parámetros deben ser obligatorios
    try {
        await productManager.addProduct({});    
    } catch (error) {
        console.log('Test Case 1: ', error.message);
    }

    //Test Case 2: todos los parámetros deben ser obligatorios
    try {
        await productManager.addProduct({title: 'Flor', price: 1000});    
    } catch (error) {
        console.log('Test Case 2: ', error.message);
    }

    //Test Case 3: tipos de datos
    try {
        await productManager.addProduct({title: 'Flor', price: 1000, thumbnail: 'Hola', code: 'AAA', stock: 'A'});    
    } catch (error) {
        console.log('Test Case 3: ', error.message);
    }

    //Test Case 4: stock negativo
    try {
        await productManager.addProduct({title: 'Flor', price: 1000, thumbnail: 'Hola', code: 'AAA', stock: -1});    
    } catch (error) {
        console.log('Test Case 4: ', error.message);
    }

    //Test Case 5: precio negativo
    try {
        await productManager.addProduct({title: 'Flor', price: -1000, thumbnail: 'Hola', code: 'AAA', stock: 9});    
    } catch (error) {
        console.log('Test Case 5: ', error.message);
    }

    //Test Case 6: Agregar tres productos
    try {
        await productManager.addProduct({title: 'Flor1', price: 1000, thumbnail: 'Hola', code: 'AAA', stock: 4});
        await productManager.addProduct({title: 'Flor2', price: 1000, thumbnail: 'Hola', code: 'AAB', stock: 5});
        await productManager.addProduct({title: 'Flor3', price: 1000, thumbnail: 'Hola', code: 'AAC', stock: 6});
        console.log('Test Case 6: 3 productos agregados exitosamente'); 
    } catch (error) {
        console.log('Test Case 6: ', error.message); 
    }
    

    //Test Case 7: Agregar producto con code duplicado
    try {
        await productManager.addProduct({title: 'Flor4', price: 1000, thumbnail: 'Hola', code: 'AAC', stock: 7});
    } catch (error) {
        console.log('Test Case 7: ', error.message); 
    }

    //Test Case 8: Busco todos los productos
    console.log('Test Case 8: ', await productManager.getProducts());

    //Test Case 9: Agrego un nuevo producto
    try {
        await productManager.addProduct({title: 'bulbo', price: 1000, thumbnail: 'Hola', code: 'nico2', stock: 7});
    } catch (error) {
        console.log('Test Case 9: ', error.message); 
    }

    //Test Case 9: Busco un producto existente por ID
    try {
        console.log('Test Case 10: ', await productManager.getProductById(2));
    } catch (error) {
        console.log('Test Case 10: ', error.message); 
    }

    //Test Case 10: Busco un producto inexistente por ID
    try {
        console.log(await productManager.getProductById(10));
    } catch (error) {
        console.log('Test Case 10: ', error.message); 
    }

    //Test Case 11: elimino un producto inexistente
    try {
        console.log(await productManager.deleteProduct(999));
    } catch (error) {
        console.log('Test Case 11: ', error.message); 
    }

    //Test Case 12: elimino un producto existente
    try {
        await productManager.deleteProduct(2);
        console.log('Test Case 12: Producto 2 eliminado'); 
    } catch (error) {
        console.log('Test Case 12: ', error.message); 
    }

    //Test Case 13: Agrego un nuevo producto
    try {
        await productManager.addProduct({title: 'bulbo raiz', price: 1000, thumbnail: 'Hola', code: 'nico4', stock: 0});
    } catch (error) {
        console.log('Test Case 13: ', error.message); 
    }

    //Test Case 14: Actualizo un producto
    try {
        await productManager.updateProduct(101, {stock: 5, title: 'a ver a ver', id: 102, code: "bianca"});
    } catch (error) {
        console.log('Test Case 14: ', error.message); 
    }

   //Test Case 15: Agrego un nuevo producto para controlar ID
   try {
        await productManager.addProduct({title: 'bulbo raiz santi', price: 1000, thumbnail: 'Hola', code: 'nico88', stock: 0});
    } catch (error) {
        console.log('Test Case 15: ', error.message); 
    }

    //Test Case 16: Actualizo un producto inexistente
    try {
        await productManager.updateProduct(1000, {stock: 5, title: 'a ver a ver', id: 102, code: "bianca"});
    } catch (error) {
        console.log('Test Case 16 ', error.message); 
    }

    //Test Case 17: Actualizo ID de un producto existente
    try {
        await productManager.updateProduct(1, {id: 999});
    } catch (error) {
        console.log('Test Case 17 ', error.message); 
    }

     //Test Case 18: Actualizo stock a negativo
     try {
        await productManager.updateProduct(1, {stock: -5});
    } catch (error) {
        console.log('Test Case 18 ', error.message); 
    }

     //Test Case 19: Actualizo con el mismo código que tenía
     try {
        await productManager.updateProduct(1, {code: 'AAA'});
        console.log('Test Case 19: Actualizado con éxito'); 
    } catch (error) {
        console.log('Test Case 19 ', error.message); 
    }

     //Test Case 20: Actualizo con un código existente en otro producto
     try {
        await productManager.updateProduct(1, {code: 'AAC'});
        console.log('Test Case 20: Actualizado con éxito'); 
    } catch (error) {
        console.log('Test Case 20 ', error.message); 
    }

     //Test Case 21: Agrego nuevo campo
     try {
        await productManager.updateProduct(1, {status: 'OK'});
        console.log('Test Case 21: Actualizado con éxito'); 
    } catch (error) {
        console.log('Test Case 21 ', error.message); 
    }


}

test();