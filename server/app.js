const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/authRouter');
const productsRouter = require('./routes/productsRouter');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouter);
app.use('/products', productsRouter);

app.get('/', (req, res) => {
    res.send('SPA');
});

const port = 3000;

app.listen(port, () => {
    console.log(`App running on port http://localhost:${port}`);
});