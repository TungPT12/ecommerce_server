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

// router admin
const signinRouterAdmin = require('./routers/admin/auth/signin')
const checkIsLoginRouterAdmin = require('./routers/admin/auth/isLogin')
const categoryRouterAdmin = require('./routers/admin/category');
const productRouterAdmin = require('./routers/admin/product');
const userRouterAdmin = require('./routers/admin/user');

// router client
const signupRouter = require('./routers/client/auth/signup')
const signinRouter = require('./routers/client/auth/login')
const checkIsLoginRouter = require('./routers/client/auth/accessToken')
const productRouter = require('./routers/client/product')
const categoryRouter = require('./routers/client/category');

const publicPathStatic = express.static(path.join(srcPath, '../public'))

const store = new MongoDBStore({
    uri: getKeyEnvironmentVariable('MONGODB_URI'),
    collection: 'session'
});

const app = express();

app.use(publicPathStatic)
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



app.use('/api', uploadImageRouter)

// admin api
app.use('/api/admin', signinRouterAdmin)
app.use('/api/admin', checkIsLoginRouterAdmin)
app.use('/api/admin', categoryRouterAdmin)
app.use('/api/admin', productRouterAdmin)
app.use('/api/admin', userRouterAdmin)

// client
app.use('/api', signupRouter)
app.use('/api', signinRouter)
app.use('/api', checkIsLoginRouter)
app.use('/api', productRouter)
app.use('/api', categoryRouter)


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
        console.log('connected')
    })
}

connectMongoose(runningServer);



