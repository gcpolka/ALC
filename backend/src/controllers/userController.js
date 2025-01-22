const { hashPassword } = require('../helpers/hashPassword');
const userModel = require('../models/userModel');

// Get user info by token
const getUserInfo = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Filter out users with the 'admin' role
        const users = await userModel.find({ }).select('-password');
        
        res.status(200).json({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Search users by role
const searchUserByRole = async (req, res) => {
    try {
        const { role } = req.query;

        if (!role) {
            return res.status(400).json({ message: "Role is required" });
        }

        const users = await userModel.find({ role });

        if (!users || users.length === 0) {
            return res.status(404).json({ message: "No users found with this role" });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// update profile
const updateProfile = async (req, res) => {
    try {
        const { title, firstName, lastName, username, password, phone,role } = req.body;
        const user = await userModel.findById(req.user._id);

        // ตรวจสอบว่า user มีอยู่จริงหรือไม่
        if (!user) {
            return res.status(404).json({ msg: "ไม่พบผู้ใช้" });
        }

        // // ตรวจสอบเบอร์โทรให้ครบ 10 ตำแหน่ง
        // if (typeof phone !== 'string' || phone.length !== 10) {
        //     return res.status(400).json({ msg: "กรุณากรอกเบอร์โทรให้ครบ 10 ตำแหน่ง" });
        // }

        // ตรวจสอบว่าอีเมลหรือเบอร์โทรนี้ถูกใช้งานแล้วหรือไม่ (ยกเว้นถ้าอีเมลหรือเบอร์เดิม)
        const existingUsername = await userModel.findOne({ username });
        const existingPhone = await userModel.findOne({ phone });

        if (existingUsername && existingUsername._id.toString() !== user._id.toString()) {
            return res.status(400).json({ msg: "อีเมลนี้ถูกใช้งานแล้ว" });
        }

        if (existingPhone && existingPhone._id.toString() !== user._id.toString()) {
            return res.status(400).json({ msg: "เบอร์โทรนี้ถูกใช้งานแล้ว" });
        }

        // แฮชรหัสผ่านถ้ามีการเปลี่ยนแปลง
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await hashPassword(password);
        }

        // อัปเดตข้อมูลผู้ใช้
        const updateUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                title: title || user.title,
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
                username: username || user.username,
                password: hashedPassword,
                phone: phone || user.phone,
                role: role || user.role,
            },
            { new: true } // Return the updated user
        );

        res.status(200).json({ msg: "อัปเดตข้อมูลผู้ใช้สำเร็จ", data: updateUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const user = await userModel.findByIdAndUpdate(id, updates, { new: true });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    getUserInfo,
    getAllUsers,
    searchUserByRole,
    getUserById,
    updateProfile,
    updateUser,
    deleteUser,
};