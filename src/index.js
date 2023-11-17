require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}))

app.listen(process.env.PORT, () => {
    console.log(`Running on http://localhost:${process.env.PORT}`)
})