require('dotenv').config();
const express = require('express');
const cors = require('cors');
const getKeyEnvironmentVariable = require('./utils/getKeyEnvironmentVariable');

const productRouter = require('./routers/product')

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

app.use('/api', productRouter)


app.listen(getKeyEnvironmentVariable('PORT'), () => {
    console.log(`Running on http://localhost:${getKeyEnvironmentVariable('PORT')}`)
})