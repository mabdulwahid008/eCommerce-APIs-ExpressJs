const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());

// CONNECT DB
db.connect();

app.use(express.json())

// ROUTES
app.use('/product', require('./routes/product.js'));
app.use('/category', require('./routes/category.js'));
app.use('/account', require('./routes/account.js'));
app.use('/order', require('./routes/order.js'));
app.use('/review', require('./routes/review.js'));


app.listen(process.env.PORT, ()=>{
    console.log(`App listening at port ${process.env.PORT}`);
})

