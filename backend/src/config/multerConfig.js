const fs = require('fs');
const path = require('path');
const multer = require('multer');

// ตั้งค่า multer สำหรับอัปโหลดไฟล์
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../uploads'); // ใช้ path แบบ relative กับตำแหน่งไฟล์ที่ทำงาน
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });  // สร้างโฟลเดอร์หากไม่มี
        }
        cb(null, uploadPath);  // ระบุ path ที่จะเก็บไฟล์
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // ตั้งชื่อไฟล์ใหม่
    }
});

// ใช้ multer สำหรับอัปโหลดหลายไฟล์
const upload = multer({ storage: storage });

module.exports = upload;
