const express = require('express')
const router = express.Router();
const db = require('../db')

// Get ALL Products
router.get('/', async(req, res)=>{
    try {
        const data = await db.query('SELECT * FROM getAllProducts')
        res.status(200).send(data.rows);
        return; 
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'SERVER ERROR'})
    }
})

// Filter Products by specific category
router.get('/category/:category', async(req, res)=>{
    const { category } = req.params;
    try {
        const data = await db.query('SELECT * FROM getAllProducts WHERE c_name = $1', [ category ])
        res.status(200).send(data.rows);
        return; 
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'SERVER ERROR'})
    }
}) 

// Filter Products by specific Price
router.get('/price/:price', async(req, res)=>{
    const { price } = req.params;
    try {
        const data = await db.query('SELECT * FROM getAllProducts WHERE p_regularPrice <= $1', [ price ])
        res.status(200).send(data.rows);
        return;
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'SERVER ERROR'})
    }
}) 

// Filter Products by both Category & Price
router.get('/filter', async(req, res)=>{
    const { category, price } = req.body;
    try {
        const data = await db.query('SELECT * FROM getAllProducts WHERE c_name = $1 AND p_regularPrice <= $2',[
            category, price
        ]);
        res.status(200).send(data.rows);
        return;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'SERVER ERROR'});
    }
})

// Add New Product
router.post('/', async(req, res)=>{
    const { p_title, p_regularPrice, p_salePrice, p_sDesc, p_lDesc, p_img1, p_img2, p_img3, p_img4, c_id } = req.body;
    try {
        //CHECKING product title already exists ?
        const check = await db.query('SELECT * FROM products WHERE p_title = $1', [ p_title ]);
        if(check.rows.length > 0){
            res.status(409).json({message : 'Product with this title already exists, please change the title'})
            return;
        }

        // IF Not 
        // 1- insert product data in product table 
        const insertProduct = await db.query('INSERT INTO products(p_title, p_regularPrice, p_salePrice, p_sDesc, p_lDesc) VALUES ($1,$2,$3,$4,$5)',[
            p_title, p_regularPrice, p_salePrice, p_sDesc, p_lDesc
        ]);

        // 2- Get Product ID which is inserted
        const getP_id = await db.query('SELECT p_id FROM products where p_title = $1',[ p_title ]);

        // 3- Assigning category ID productCategory
        const assignCategory = await db.query('INSERT INTO productCategory(c_id, p_id) VALUES ($1, $2)',[ c_id, getP_id.rows[0].p_id])

        //  4- Inserting images in productImg by p_id, storing through VIEW
        const assignImages = await db.query('INSERT INTO insertProductImages VALUES ($1,$2,$3,$4, $5)',[ getP_id.rows[0].p_id, p_img1, p_img2, p_img3, p_img4 ]);

        res.status(200).json({message: 'Product Added'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'Server Error'});
    }
})

// Update Product
router.put('/', async(req, res)=>{
    const { p_id, p_title, p_regularPrice, p_salePrice, p_sDesc, p_lDesc, p_img1, p_img2, p_img3, p_img4, c_id } = req.body;
    try {
        //CHECKING product with this title already exists ?
        const check = await db.query('SELECT * FROM products WHERE p_title = $1', [ p_title ]);
        if(check.rows.length > 0){
            res.status(409).json({message : 'Product with this title already exists, please change the title'})
            return;
        }

        // IF Not then 
        // Update product data in products table
        const productTable = await db.query('UPDATE products SET p_title = $1, p_regularPrice = $2, p_salePrice = $3, p_sDesc = $4, p_lDesc = $5 WHERE p_id = $6',[
            p_title, p_regularPrice, p_salePrice, p_sDesc, p_lDesc, p_id
        ]);

        // Update categoryID in productCategoy
        const updateCategory = await db.query('UPDATE productCategory SET c_id = $1 WHERE p_id = $2',[c_id, p_id ]);

        // Update product images in productImg 
        const updateImages = await db.query('UPDATE insertProductImages SET p_img1 = $1, p_img2 = $2, p_img3 =$3, p_img4 = $4 WHERE p_id = $5',[
            p_img1, p_img2, p_img3, p_img4, p_id
        ]);

        res.status(200).json({message:'Product Updated'})

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

// Delete Product
router.delete('/:p_id', async(req, res)=>{
    try {
        const deleteProduct = await db.query('DELETE FROM products WHERE p_id = $1', [req.params.p_id])
        res.status(200).json({message: 'Deleted Product'});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})


module.exports = router