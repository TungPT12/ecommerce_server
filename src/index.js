require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getKeyEnvironmentVariable = require('./utils/getKeyEnvironmentVariable');
const session = require('express-session');
const connectMongoose = require('./configs/mongoose');
const MongoDBStore = require('connect-mongodb-session')(session);
const socketIO = require('./utils/socket');
const path = require('path');
const srcPath = require('./utils/path');

// router upload images
const uploadImageRouter = require('./routers/uploadImage')
const chatRouter = require('./routers/chat')

// router admin
const authnRouterAdmin = require('./routers/admin/authn')
const categoryRouterAdmin = require('./routers/admin/category');
const productRouterAdmin = require('./routers/admin/product');
const userRouterAdmin = require('./routers/admin/user');
const orderRouterAdmin = require('./routers/admin/order');

// router client
const authnRouter = require('./routers/client/authn')
const productRouter = require('./routers/client/product')
const categoryRouter = require('./routers/client/category');
const cartRouter = require('./routers/client/cart');
const orderRouter = require('./routers/client/order');

const publicPathStatic = express.static(path.join(srcPath, '../public'))

const store = new MongoDBStore({
    uri: getKeyEnvironmentVariable('MONGODB_URI'),
    collection: 'session'
});

const app = express();

app.use(publicPathStatic)
app.use(express.json());
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://eccomerce-admin.netlify.app',
        'https://tung-store.netlify.app',
    ],
    credentials: true
}));

app.use(session({
    secret: getKeyEnvironmentVariable('SECRET_KEY'),
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        httpOnly: false,
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}))



app.use('/api', uploadImageRouter);
app.use('/api', chatRouter);

// admin api
app.use('/api/admin', authnRouterAdmin);
app.use('/api/admin', categoryRouterAdmin);
app.use('/api/admin', productRouterAdmin);
app.use('/api/admin', userRouterAdmin);
app.use('/api/admin', orderRouterAdmin);

// client
app.use('/api', authnRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);


const runningServer = () => {
    const server = app.listen(getKeyEnvironmentVariable('PORT'), () => {
        console.log(`Running on http://localhost:${getKeyEnvironmentVariable('PORT')}`)
    })

    socketIO.initIO(server, {
        cors: {
            origin: '*',
            method: ['POST', 'GET']
        }
    });

    socketIO.getIO().on('connection', (socket) => {
    })
}

connectMongoose(runningServer);



