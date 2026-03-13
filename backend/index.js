const express = require('express');
const bodyParser = require('body-parser');
const mysql =require('mysql2/promise')
const app = express();
const cors= require('cors');

const port = 1304

app.use(bodyParser.json());
app.use(cors());





let conn=null
const initDBConnection =async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password:'root',
        database: 'webdb',
        port:4312

    });
}
initDBConnection();
app.get('/users', async (req,res) => {
    const results = await conn.query('SELECT * FROM users');
    res.json(results[0]);
})


app.post('/users',async (req,res) => {
    let user = req.body;
    const result = await conn.query('INSERT INTO users SET ?', user);
        console.log('result',result)
        res.json({
            message: 'User added successfully',
            data: result[0]
        })
})
app.put('/users/:id', async (req, res) => {
    let id = req.params.id;
        let user = req.body;
        const result = await conn.query('UPDATE users SET ? WHERE id = ?',[user,id]);
        if (result[0].length == 0) {
            throw {statusCode: 404,message: 'User not found'}
        }
        res.json({
            message: 'User updated succ',
            data:user
        })
})



app.delete('/users/:id', async (req, res) =>{
    let id = req.params.id;
    let user = req.body;
    const result = await conn.query('DELETE FROM users WHERE id = ?',id);
        if (result[0].length == 0) {
            throw {statusCode: 404,message: 'User not found'}
        }
        res.json({
            message: 'User delete success',
            })
})



app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});

