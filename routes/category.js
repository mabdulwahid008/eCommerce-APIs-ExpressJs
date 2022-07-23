const express = require('express');
const db = require('../db');
const router = express.Router();

// Add Category 
router.post('/', async(req, res)=>{
    const { c_name, c_img } = req.body;
    console.log(req.body);
    try {
        const check = await db.query('SElECT * FROM getCategories WHERE c_name = $1', [c_name])
        if(check.rows.length > 0){
            res.status(409).json({message: 'Category already exists'});
            return;
        }

        const data = await db.query('INSERT INTO insertCategory VALUES($1, $2)',[
            c_name, c_img
        ]);
        res.status(200).json({message: 'New Category Added'});
        return;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

// Get All Categories
router.get('/', async(req, res)=>{
    try {
        const data = await db.query('SELECT * FROM getCategories');
        res.status(200).send(data.rows);
        return;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

// Delete Specific Category
router.delete('/', async(req, res)=>{
    const { c_name } = req.body;
    try {
        const data = await db.query('DELETE FROM getCategories WHERE c_name = $1', [ c_name ]);
        res.status(200).json({Success : 'Deleted Successfully'});
        return;
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

// Update Category Name
router.put('/:id', async(req, res)=>{
    const { c_name } = req.body;
    try {
        const check = await db.query('SElECT * FROM getCategories WHERE c_name = $1', [c_name])
        if(check.rows.length > 0){
            res.status(409).json({message: 'Category with this name already exists'});
            return;
        }
        const name = await db.query('UPDATE getCategories SET c_name = $1 WHERE c_id = $2', [ c_name, req.params.id]);
        res.status(200).json({message : 'Updated Successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'});
    }
})

// Update Category Image
router.put('/', async(req, res)=>{
    const { c_name, c_img } = req.body;
    try {
        const img = await db.query('Update insertCategory SET c_img = $1 WHERE c_name = $2',[ c_img, c_name ]);
        res.status(200).json({message : 'Updated Successfully'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'});
    }
})

module.exports = router