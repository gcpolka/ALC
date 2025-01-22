const { hashPassword, comparePassword } = require('../helpers/hashPassword');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    try {
        const { title, firstName, lastName, username, password, phone,role } = req.body;

        // ตรวจสอบเบอร์โทรให้ครบ 10 ตำแหน่ง
        if (typeof phone !== 'string' || phone.length !== 10) {
            return res.status(400).json({ msg: "กรุณากรอกเบอร์โทรให้ครบ 10 ตำแหน่ง" });
        }

        // ตรวจสอบว่าอีเมล์หรือเบอร์โทรนี้ถูกใช้งานแล้วหรือไม่
        const existingUsername = await userModel.findOne({ username });
        const existingPhone = await userModel.findOne({ phone });

        if (existingUsername) {
            return res.status(400).json({ msg: "อีเมลนี้ถูกใช้งานแล้ว" });
        }

        if (existingPhone) {
            return res.status(400).json({ msg: "เบอร์โทรนี้ถูกใช้งานแล้ว" });
        }

        // แฮชรหัสผ่าน
        const hashedPassword = await hashPassword(password);

        // สร้างผู้ใช้ใหม่
        const newUser = new userModel({
            title,
            firstName,
            lastName,
            username,
            password: hashedPassword,
            phone,
            role
        });

        // บันทึกผู้ใช้ใหม่ในฐานข้อมูล
        await newUser.save();

        res.status(201).json({ msg: "User created successfully", data: newUser });
    } catch (error) {
        console.error("Error: " + error);
        res.status(500).json({
            status_code: 500,
            msg: 'Internal Server Error'
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).send({
                message: "อีเมลไม่ได้ลงทะเบียน",
            });
        }

        const passwordMatch = await comparePassword(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                status_code: 401,
                msg: 'รหัสผ่านไม่ถูกต้อง'
            });
        }

        const jwtToken = jwt.sign({
            _id: user._id,
            username: user.username,
            role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional token expiration
        );

        res.status(200).json({
            success: true,
            msg: "Login successfully",
            data: {
                full_name: `${user.title} ${user.firstName} ${user.lastName}`,
                username: user.username,
                tel: user.tel,
                role: user.role,
                token: jwtToken
            }
        });
    } catch (error) {
        console.error("Error: " + error);
        res.status(500).json({
            status_code: 500,
            msg: 'Internal Server Error'
        });
    }
};

const autoCreateAdmin = async () => {
    try {
        const existingAdmin = await userModel.findOne({ role: "admin" });

        if (!existingAdmin) {
            const hashedPassword = await hashPassword("1234");
            const admin = new userModel({
                title: null,
                firstName: "System",
                lastName: "Administrator",
                username: "admin",
                password: hashedPassword,
                phone: "0000000000",
                role: "admin"
            });

            await admin.save();
            console.log("Admin user created successfully.");
        } else {
            console.log("Admin user already exists.");
        }
    } catch (error) {
        console.error("Failed to create admin user:", error);
    }
};


module.exports = {
    register,
    login,
    autoCreateAdmin
}