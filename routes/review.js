const express = require('express');
const router = express.Router();
const db = require('../db')
const authorization = require('../middleware/authorization');

// Add review
router.post('/', authorization, async(req, res)=>{
    const { p_id, r_text } = req.body;
    try {
        const data =  await db.query('INSERT INTO review(p_id, r_text, a_id) VALUES($1, $2, $3)',[
            p_id, r_text, req.user_id
        ]);
        res.status(200).json({message: 'Added'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'})
    }
})

// Get all reviews of specific product
router.get('/:p_id', async(req, res)=>{
    try {
        const data = await db.query('select r_id, r_text, a_name from review inner join account on review.a_id = account.a_id WHERE p_id = $1', [ req.params.p_id ]);
        res.status(200).send(data.rows);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'})
    }
})

// Delete Review
router.delete('/:r_id', authorization, async(req, res)=>{
    try {
        const data = await db.query('DELETE FROM review WHERE r_id = $1',[ req.params.r_id ]);
        res.status(200).json({message: 'Deleted' })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:'Server Error'})
    }
})

module.exports = router