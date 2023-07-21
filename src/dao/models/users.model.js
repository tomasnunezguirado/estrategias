import mongoose from 'mongoose';

const usersCollection = 'users';

const usersSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    birthDate: { type: Date },
    password: { type: String },
})

const UsersModel = mongoose.model(usersCollection, usersSchema);

export default UsersModel;