const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwtGenertor = require('../utills/jwtGenerator');
const authorization = require('../middleware/authorization');

// Create an account
router.post('/', async(req, res)=>{
    const { a_name, a_username, a_password, a_type, a_email } = req.body;
    try {
        // check user with this email exists already ?
        const checkEmail = await db.query('SELECT * FROM account WHERE a_email = $1',[ a_email ])
        if(checkEmail.rows.length > 0){
            res.status(409).json({message: 'User with this email already exists'});
            return;
        }

        // check user with this username exists already ?
        const checkUsername = await db.query('SELECT * FROM account WHERE a_username = $1',[ a_username ])
        if(checkUsername.rows.length > 0){
            res.status(409).json({message: 'User with this username already exists'});
            return;
        }

        // IF not then
        // Bycrypt password 
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound); // gives random string
        const BcryptPassword = await bcrypt.hash(a_password, salt); // generate random hash value and added salt with it

        // Store user 
        const data = await db.query('INSERT INTO account(a_name, a_username, a_password, a_type, a_email) VALUES ($1, $2, $3, $4, $5)',[
            a_name, a_username, BcryptPassword, a_type, a_email
        ])

        // Generte JWT 
        const token = jwtGenertor(a_username);
        // res.status(200).json({message : 'Registered Successfully'})
        res.status(200).json({token});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'Server Error'})
    }
})

// Login
router.post('/login', async(req, res)=>{
    const { a_username, a_password, } = req.body;
    try {
        // checks user with this username exists ?
        const check = await db.query('SELECT * FROM account WHERE a_username = $1', [ a_username ]);
        if(check.rows.length === 0){
            return res.status(404).json({message : 'Incorrect username or password'})
        }

        // Compare password
        const validPass = await bcrypt.compare(a_password, check.rows[0].a_password);

        // if validpass == false
        if(!validPass){
            return res.status(404).json({message : 'Incorrect password'})
        }

        //
        const token = jwtGenertor(check.rows[0].a_id);
        res.status(200).json({token});

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message : 'Server Error'})
    }
})

// Get Logged in Ingo
router.get('/', authorization, async(req, res)=>{
    try {
        const data = await db.query('SELECT * FROM account WHERE a_id = $1 AND a_status = $2',[ req.user_id, 'ACTIVATED' ])
        res.status(200).send(data.rows)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})

// Update Account
router.put('/', authorization, async(req, res)=>{
    const { a_name, a_username, a_password, a_type, a_email } = req.body;
    try {
        const updateAccount = await db.query('UPDATE account SET a_name = $1, a_username =$2, a_password = $3, a_type = $4, a_email = $5 WHERE a_id = $6',[
            a_name, a_username, a_password, a_type, a_email, req.user_id
        ])
        res.status(200).json({message: 'Account Updated'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'})
    }
})
// Deactivae Account
router.put('/deactivate', authorization, async(req, res)=>{
    try {
        // Not deleteting from DB because the account may have orders, so we have to keep the orders detail for admin 
        const deactivateAccount = await db.query('UPDATE account SET a_status = $1 WHERE a_id = $2',[ 'DEACTIVATED', req.user_id]);
        res.status(200).json({message:'Account Deactivated'})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: 'Server Error'});
    }
})

module.exports = router;