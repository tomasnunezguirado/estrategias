import express from 'express';
import __dirname from './utils/utils.js'
import handlebars from 'express-handlebars';
import cors from 'cors';
import path from 'path';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import messagesRouter from './routes/messages.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/sessions.router.js'
import { Server } from 'socket.io';
import { productsUpdated, chat } from './utils/socketUtils.js';
import displayRoutes from 'express-routemap';
import mongoose from 'mongoose';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import flash from 'connect-flash';

const PORT = 8080;

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

const MONGO = "mongodb+srv://LucasBazzini:pass..@cluster.ccdvok9.mongodb.net/?retryWrites=true&w=majority" 
const connection = mongoose.connect(MONGO)

mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log(`MongoDB connection successful to ${DB_NAME} database`);
})
.catch(err => {
    console.log(`Cannot connect to MongoDB ${DB_NAME} database`);
});

app.use(session({
    store: new MongoStore({
        mongoUrl: mongo,
        ttl: 3600
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))


initializePassport(passport);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/files', express.static(path.join(__dirname, './public')));
app.use('/api/alive', (req, res) => {
    res.status(200).json({ status: 1, message: 'Flowery 4107 backend is alive' });
});
app.use('/api/sessions', sessionsRouter);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/messages', messagesRouter);
app.use('/', viewsRouter);



const serverHttp = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Flowery 4107 Backend server is now up on port ${PORT}`)
});

const io = new Server(serverHttp);

app.set('io', io);

io.on('connection', socket => {
    console.log('New client connected', socket.id);
    productsUpdated(io);
    chat(socket, io);
});