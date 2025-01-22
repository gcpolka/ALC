const fs = require("fs");
const path = require('path');
const stepTestModel = require("../models/stepTestModel");

const createStepTest = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "กรุณาอัปโหลดรูปภาพ" });
    }

    const imageUrl = req.files.map((file) => `/uploads/${file.filename}`);

    const {
      date,
      dma,
      houseNumber,
      villageNo,
      subdistrict,
      district,
      province,
      stepTest,
      roundNo,
      value,
      inspector
    } = req.body;

    req.files.forEach((file) => {
      if (file.size > 5000000) {
        return res.status(400).json({ msg: "รูปควรมีขนาดน้อยกว่าหรือเท่ากับ 5 MB" });
      }
    });

    // สร้าง Array ของ rounds จากข้อมูลที่ได้รับ
    const roundsArray = roundNo && stepTest && value
      ? roundNo.map((round, index) => ({
        roundNo: round,
        stepTest: stepTest[index],
        value: value[index],
      }))
      : [];

    const newStepTest = new stepTestModel({
      date,
      dma,
      houseNumber,
      villageNo,
      subdistrict,
      district,
      province,
      rounds: roundsArray, // เก็บข้อมูลรอบ
      images: imageUrl,
      inspector,
    });
    // console.log(newStepTest)
    await newStepTest.save();

    res.status(201).json({
      msg: "Step Test Created Successfully",
      data: newStepTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStepTestInfo = async (req, res) => {
  try {
    const query = await stepTestModel.find({ inspector: req.user._id }).populate('inspector');

    return res.status(200).json({
      data: query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const listStepTest = async (req, res) => {
  try {
    const query = await stepTestModel.find().populate('inspector');

    return res.status(200).json({
      data: query,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStepTestById = async (req, res) => {
  try {
    const { id } = req.params;
    const stepTestData = await stepTestModel.findById(id).populate('inspector');

    if (!stepTestData) {
      return res.status(404).json({ message: "step test not found" });
    }

    res.status(200).json({ data: stepTestData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateStepTest = async (req, res) => {
  try {
    const { id } = req.params;

    // ดึงข้อมูล step test ที่จะอัปเดตจากฐานข้อมูล
    const stepTest = await stepTestModel.findById(id);
    if (!stepTest) {
      return res.status(404).json({ message: "Step test not found" });
    }

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

    const {
      date,
      dma,
      houseNumber,
      villageNo,
      subdistrict,
      district,
      province,
      stepTest: stepTestArray,
      roundNo,
      value,
      inspector
    } = req.body;

    // สร้าง Array ของ rounds
    const roundsArray = roundNo && stepTestArray && value
      ? roundNo.map((round, index) => ({
        roundNo: round,
        stepTest: stepTestArray[index],
        value: value[index],
      }))
      : [];

    // อัปเดตข้อมูล step test
    const updatedStepTest = await stepTestModel.findByIdAndUpdate(id, {
      date,
      dma,
      houseNumber,
      villageNo,
      subdistrict,
      district,
      province,
      rounds: roundsArray, // อัปเดตข้อมูลรอบ
      images: imageUrls.length > 0 ? imageUrls : undefined,
      inspector,
    });

    res.status(200).json({
      msg: "Step test Updated Successfully",
      data: updatedStepTest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteStepTest = async (req, res) => {
  try {
    const { id } = req.params;

    const stepTestToDelete = await stepTestModel.findById(id);

    if (!stepTestToDelete) {
      return res.status(404).json({ message: "step test not found" });
    }

    if (stepTestToDelete.images && stepTestToDelete.images.length > 0) {
      stepTestToDelete.images.forEach((imagePath) => {
        const filePath = path.join(__dirname, '..', 'uploads', imagePath.replace('/uploads/', ''));

        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    const deletedStepTest = await stepTestModel.findByIdAndDelete(id);

    if (!deletedStepTest) {
      return res.status(404).json({ message: "step test not found" });
    }

    res.status(200).json({
      msg: "step test Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createStepTest,
  getStepTestInfo,
  listStepTest,
  getStepTestById,
  updateStepTest,
  deleteStepTest,
};
