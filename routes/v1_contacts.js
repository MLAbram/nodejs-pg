const express = require('express');
const app = express();
const joi = require('joi');
const pool = require('./pg_db');

const addRecordSchema = joi.object({
  first_name: joi.string().max(50).required(),
  last_name: joi.string().max(50).required(),
  email: joi.string().min(5).max(50).required().email(),
  phone: joi.string().min(0).max(20),
  addr1: joi.string().min(0).max(50),
  addr2: joi.string().min(0).max(50),
  city: joi.string().min(0).max(50),
  state: joi.string().min(0).max(50),
  zip_code: joi.string().min(0).max(10),
  notes: joi.string().min(0).max(50)
});

const updateRecordSchema = joi.object({
    first_name: joi.string().min(0).max(50),
    last_name: joi.string().min(0).max(50),
    email: joi.string().min(0).max(50).email(),
    phone: joi.string().min(0).max(20),
    addr1: joi.string().min(0).max(50),
    addr2: joi.string().min(0).max(50),
    city: joi.string().min(0).max(50),
    state: joi.string().min(0).max(50),
    zip_code: joi.string().min(0).max(10),
    notes: joi.string().min(0).max(50)
  });

// redirect user
app.get('/', (req, res) => {
  res.redirect('https://dynamismconsulting.com/');
});

// get all records
app.get('/getRecords', async (req, res) => {     
    const result = pool.query('select * from demo.contacts;', (error, results) => {
        if (error) res.status(400).send(error);
        res.status(200).json(results.rows);
    });
});

// get single record using id
app.get('/getRecord/:id', async (req, res) => { 
    const id = parseInt(req.params.id);  // get id user entered
    
    const result = pool.query('select * from demo.contacts where contacts_id = $1;', [id], (error, results) => {
        if (error) return res.status(400).json({Error: error.message});
        res.status(200).json(results.rows);
    });
});

// add record
app.post('/addRecord', async (req, res) => {
    // validate user data
    const validation = addRecordSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    const {first_name,last_name,email,phone,addr1,addr2,city,state,zip_code,notes} = req.body;  // get values sent by

    // validate email does not exist
    pool.query('select * from demo.contacts where email_t = $3;', [req.body.email], (error, results) => {
        if (results.rows.length) {
            res.send('User Already Exists...');
        }
        
        // insert new record
        pool.query('insert into demo.contacts (first_name_t,last_name_t,email_t,phone_t,addr1_t,addr2_t,city_t,state_t,zip_code_t,notes_t) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);', [first_name,last_name,email,phone,addr1,addr2,city,state,zip_code,notes], (error, results) => {
            if (error) return res.status(400).send(error);
            res.status(200).send('Record Added Successfully...');
        })
    })
});

// delete record
app.delete('/deleteRecord/:id', async (req, res) => {
    const id = parseInt(req.params.id);  // get id user entered

    // validate if id exist
    pool.query('select * from demo.contacts where contacts_id = $1;', [id], (error, results) => {
        const noID = !results.rows.length;
        if (noID) return res.status(400).send('ID Does Not Exist...');

        pool.query('delete from demo.contacts where contacts_id = $1;', [id], (error, results) => {
            if (error) {
                return res.status(400).send(error);
            } else {
                res.status(200).send('Record Deleted Successfully...');
            }
        })
    })
})

// update record
app.put('/updateRecord/:id', async (req, res) => {
    const id = parseInt(req.params.id);  // get id user entered

    // validate user data
    const validation = updateRecordSchema.validate(req.body);
    if (validation.error) return res.status(400).send(validation.error);

    const {first_name,last_name,email,phone,addr1,addr2,city,state,zip_code,notes} = req.body;  // get values sent by

    // validate if id exist
    pool.query('select * from demo.contacts where contacts_id = $1;', [id], (error, results) => {
        const noID = !results.rows.length;
        if (noID) return res.status(400).send('ID Does Not Exist...');

        pool.query('update demo.contacts set first_name_t = coalesce($1, first_name_t), last_name_t = coalesce($2, last_name_t), email_t = coalesce($3, email_t), phone_t = coalesce($4, phone_t), addr1_t = coalesce($5, addr1_t), addr2_t = coalesce($6, addr2_t), city_t = coalesce($7, city_t), state_t = coalesce($8, state_t), zip_code_t = coalesce($9, zip_code_t), notes_t = coalesce($10, notes_t), aud_update_ts = now() where contacts_id = $11;', [first_name,last_name,email,phone,addr1,addr2,city,state,zip_code,notes,id], (error, results) => {
            if (error) {
                return res.status(400).send(error);
            } else {
                res.status(200).send('Record Updated Successfully...');
            }
        })
    })
})

module.exports = app;