const express = require('express');
const router = express.Router();
const db = require('../db');
const authorization = require('../middleware/authorization');

// Create an order
router.post('/', authorization, async(req, res)=>{
    try {
       
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

module.exports = router