import { ProductManager } from '../dao/managers/products.manager.js'
import { MessagesManager } from '../dao/managers/messages.manager.js';

const productManager = new ProductManager();
const messageManager = new MessagesManager();

const productsUpdated = async (io) => {
    const products = await productManager.getProducts();
    io.emit('productsUpdated', products.products);  
};

const chat = async (socket, io) => {
    socket.on('authenticated', async (data) => {
        const messages = await messageManager.getMessages();
        socket.emit('messageLogs', messages); 
        socket.broadcast.emit('newUserConnected', data); 
    });

    socket.on('message', async (data) => {
        const { user, message } = data;
        const newMessage = await messageManager.addMessage(user, message);
        const messages = await messageManager.getMessages();
        io.emit('messageLogs', messages); 
    });
};

export { productsUpdated , chat };