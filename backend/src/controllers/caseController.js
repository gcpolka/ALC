const caseModel = require("../models/caseModel");
const upload = require('../config/multerConfig');
const path = require('path');
const fs = require('fs');

const createCase = async (req, res) => {
    try {
        // ตรวจสอบว่าไฟล์มีหรือไม่
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: "กรุณาอัปโหลดรูปภาพ" });
        }

        // ดึง URL ของไฟล์ที่อัปโหลด
        const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

        // ดึงข้อมูลที่ต้องการจาก req.body
        const {
            date, numberWork, houseNumber, villageNo, subdistrict, district, province,
            latitude, longitude, pipe, size, dma, inspector, status
        } = req.body;

        // ตรวจสอบขนาดไฟล์
        req.files.forEach(file => {
            if (file.size > 5000000) { // ขนาดไฟล์ไม่เกิน 5 MB
                return res.status(400).json({ msg: "รูปควรมีขนาดน้อยกว่าหรือเท่ากับ 5 MB" });
            }
        });

        // สร้างเอกสารใหม่
        const newCase = new caseModel({
            date, numberWork, houseNumber, villageNo, subdistrict, district, province,
            latitude, longitude, pipe, size, dma,
            images: imageUrls, // เก็บ URL รูปภาพในฐานข้อมูล
            inspector,
            status: "รอการอนุมัติ"
        });

        await newCase.save();

        res.status(201).json({
            msg: "Case Created Successfully",
            data: newCase,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getCaseInfo = async (req, res) => {
    try {
        const query = await caseModel.find({ inspector: req.user._id })
            .populate('pipe')
            .populate('inspector');

        res.status(200).json({ data: query })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const listCase = async (req, res) => {
    try {
        const query = await caseModel.find().populate('pipe').populate('inspector') // ดึงข้อมูลทั้งหมดจากฐานข้อมูล
        res.status(200).json({ data: query })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

const getCaseById = async (req, res) => {
    try {
        const { id } = req.params;
        const caseData = await caseModel.findById(id).populate('pipe').populate('inspector');

        if (!caseData) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.status(200).json({ data: caseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const searchCaseStatus = async (req, res) => {
    try {
        const { status } = req.query;

        const caseByStatus = await caseModel.find({ status: status }).populate('pipe').populate('inspector');

        if (!caseByStatus || caseByStatus.length === 0) {
            return res.status(404).json({ message: "Case not found" });
        }
        res.status(200).json({ data: caseByStatus });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

const updateCase = async (req, res) => {
    try {
        const { id } = req.params;

        // เก็บ URL ของรูปภาพใหม่ที่อัปโหลด
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

            // ตรวจสอบขนาดไฟล์
            req.files.forEach((file) => {
                if (file.size > 5000000) {
                    return res.status(400).json({ msg: "รูปควรมีขนาดน้อยกว่าหรือเท่ากับ 5 MB" });
                }
            });

            // ลบรูปภาพเก่าก่อนที่จะอัปเดต
            if (stepTest.images && stepTest.images.length > 0) {
                stepTest.images.forEach((oldImage) => {
                    // สร้างเส้นทางที่ถูกต้องในการลบไฟล์
                    const imagePath = path.join(__dirname, '..', 'uploads', oldImage.replace('/uploads/', ''));
                    console.log(`กำลังลบไฟล์: ${imagePath}`);
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error(`ไม่สามารถลบไฟล์ ${oldImage} ได้`, err);
                        }
                    });
                });
            }
        }

        // Extract other fields from the request body
        const {
            date, numberWork, houseNumber, villageNo, subdistrict, district, province,
            latitude, longitude, pipe, size, dma, inspector,status
        } = req.body;

        // Update the case in the database
        const updatedCase = await caseModel.findByIdAndUpdate(
            id,
            {
                date, numberWork, houseNumber, villageNo, subdistrict, district, province,
                latitude, longitude, pipe, size, dma,
                images: imageUrls.length > 0 ? imageUrls : undefined, inspector,status
            }
        );

        if (!updatedCase) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.status(200).json({
            msg: "Case Updated Successfully",
            data: updatedCase,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteCase = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the case by ID first to get the images before deleting the case
        const caseToDelete = await caseModel.findById(id);

        if (!caseToDelete) {
            return res.status(404).json({ message: "Case not found" });
        }

        // Delete images from the uploads folder
        if (caseToDelete.images && caseToDelete.images.length > 0) {
            caseToDelete.images.forEach(imagePath => {
                // Construct the full file path (use 'uploads' folder relative path)
                const filePath = path.join(__dirname, '..', 'uploads', imagePath.replace('/uploads/', ''));

                // Check if the file exists and then delete
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); // Delete the file from the filesystem
                }
            });
        }

        // Now delete the case from the database
        const deletedCase = await caseModel.findByIdAndDelete(id);

        if (!deletedCase) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.status(200).json({
            msg: "Case Deleted Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createCase,
    getCaseInfo,
    listCase,
    getCaseById,
    searchCaseStatus,
    updateCase,
    deleteCase,
};
