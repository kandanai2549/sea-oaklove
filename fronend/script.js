// ในไฟล์ script.js
const loginUser = async () => {
    // 1. ดึงค่า
    const empId = document.getElementById('emp-id').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (!empId || !pass) {
        alert("กรุณากรอกข้อมูลให้ครบ!");
        return;
    }

    console.log("🛰️ กำลังส่งข้อมูล:", empId, pass);

    try {
        // 2. ส่งไปหลังบ้าน
        const response = await axios.post('http://localhost:1304/login', {
            employeeId: empId,
            password: pass
        });

        // 3. ถ้าสำเร็จ
        if (response.data.success) {
            localStorage.setItem('employeeName', response.data.userName);
            alert("✅ ยินดีต้อนรับคุณ " + response.data.userName);
            window.location.href = 'home.html'; 
        }

    } catch (error) {
        console.error("Error:", error);
        alert("❌ ไม่พบข้อมูล หรือรหัสไม่ถูกต้อง (Error 401)");
    }
};