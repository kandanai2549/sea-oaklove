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



// ในไฟล์ index.js (ส่วน /login)
// ในไฟล์ index.js (ส่วน /login)
app.post('/login', async (req, res) => {
    try {
        // 1. ปริ้นท์ "ข้อมูลดิบ" ทั้งก้อนที่หน้าบ้านส่งมาดูเลยว่ามีอะไรบ้าง!
        console.log("📥 ข้อมูลดิบที่รับมา (req.body):", req.body);

        // ดึงค่าออกมา
        const { employeeId, password } = req.body;

        // 2. เช็คว่าข้อมูลมาครบไหม
        if (!employeeId || !password) {
            console.log("❌ ข้อมูลมาไม่ครบ! (อาจจะพิมพ์ชื่อตัวแปรผิดที่หน้าบ้าน)");
            return res.status(400).json({ success: false, message: "ส่งข้อมูลมาไม่ครบ" });
        }

        console.log(`🔍 กำลังหาใน DB -> ID: [${employeeId}] | Pass: [${password}]`);

        // 3. ค้นหาในฐานข้อมูล (ใช้ตัวหนังสือธรรมดาเลย MySQL จัดการให้ได้)
        const sql = "SELECT * FROM users WHERE `emp-id` = ? AND password = ?";
        const [users] = await conn.query(sql, [employeeId, password]);

        if (users.length > 0) {
            console.log("🎉 Login ผ่าน! ข้อมูลตรงกันเป๊ะ");
            res.json({ success: true, userName: users[0].password });
        } else {
            console.log("❌ หาไม่เจอ! ID หรือ รหัสผ่านไม่ตรงกับใน DB");
            res.status(401).json({ success: false, message: "รหัสไม่ถูกต้อง" });
        }

    } catch (err) {
        console.error("Backend Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});



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

