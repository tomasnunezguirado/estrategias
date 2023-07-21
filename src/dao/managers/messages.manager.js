import MessagesModel from '../models/messages.model.js';

class MessagesManager {
  async getMessages() {
    try {
      const messages = await MessagesModel.find();
      return messages;
    } catch (error) {
      throw new Error(`Error al recuperar mensajes: ${error.message}`);
    }
  }

  async addMessage(user, message) {
    try {
      const newMessage = await MessagesModel.create({ user, message });
      return newMessage;
    } catch (error) {
      throw new Error(`Error al agregar el mensaje : ${error.message}`);
    }
  }
}

export { MessagesManager }