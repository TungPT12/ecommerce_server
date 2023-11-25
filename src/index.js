require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getKeyEnvironmentVariable = require('./utils/getKeyEnvironmentVariable');
const session = require('express-session');
const productRouter = require('./routers/product');
const connectMongoose = require('./configs/mongoose');
const MongoDBStore = require('connect-mongodb-session')(session)

const store = new MongoDBStore({
    uri: getKeyEnvironmentVariable('MONGODB_URI'),
    collection: 'session'
});

const app = express();

app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use(session({
    secret: getKeyEnvironmentVariable('SECRET_KEY'),
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))

app.use('/api', productRouter)


const runningServer = () => {
    const server = app.listen(getKeyEnvironmentVariable('PORT'), () => {
        console.log(`Running on http://localhost:${getKeyEnvironmentVariable('PORT')}`)
    })

    const io = require('socket.io')(server, {
        cors: {
            origin: '*',
            method: ['GET', 'POST'],
        }
    });
    io.on('connection', (socket) => {
        console.log('connected')
        // socket.on('admin', (data) => {

        // })
    })
}

connectMongoose(runningServer);



