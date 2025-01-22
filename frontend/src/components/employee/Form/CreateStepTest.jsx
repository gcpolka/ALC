import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import stepTesstService from '../../../service/stepTestService';
import userService from './../../../service/userService';

const CreateStepTest = () => {
  const [formData, setFormData] = useState({
    date: "",
    dma: "",
    houseNumber: "",
    villageNo: "",
    subdistrict: "",
    district: "",
    province: "",
    // rounds: [{ roundNo: 1, stepTest: "", value: "" }],
    rounds: [{ roundNo: 1, stepTest: "", value: "" }],
    images: [],
    inspector: "",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();
  const stepTestOptions = ["CV", "SCV"];

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await userService.userInfo();
        setUserInfo(res.data.data);
        setFormData((prevData) => ({
          ...prevData,
          inspector: res.data.data._id,  // เก็บแค่ _id
        }));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.res?.data?.msg || "An unexpected error occurred.",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    }
    fetchUserInfo();
  }, []);

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRounds = [...formData.rounds];
    updatedRounds[index][name] = value;
    setFormData({ ...formData, rounds: updatedRounds });
  };

  // const handleAddRound = () => {
  //   const nextRoundNo = formData.rounds.length + 1; // คำนวณเลขรอบใหม่
  //   setFormData({
  //     ...formData,
  //     rounds: [
  //       ...formData.rounds,
  //       { roundNo: nextRoundNo, stepTest: "", value: "" },
  //     ],
  //   });
  // };

  const handleAddRound = () => {
    setFormData({
      ...formData,
      rounds: [
        ...formData.rounds,
        { roundNo: "", stepTest: "", value: "" },
      ],
    });
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = formData.rounds.filter((_, i) => i !== index);
    setFormData({ ...formData, rounds: updatedRounds });
  };

  const handleFileChange = (e) => {
    const validTypes = ["image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    const files = Array.from(e.target.files);

    const validFiles = files.filter(
      (file) => validTypes.includes(file.type) && file.size <= maxFileSize
    );

    if (validFiles.length !== files.length) {
      Swal.fire({
        title: "ไฟล์ไม่ถูกต้อง!",
        text: "โปรดตรวจสอบว่าไฟล์ทั้งหมดเป็น JPEG/PNG และมีขนาดไม่เกิน 5MB.",
        icon: "error",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    setImages(validFiles);
    setPreviewImages(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const removePreviewImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedImages = images.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    form.append("date", formData.date);
    form.append("dma", formData.dma);
    form.append("houseNumber", formData.houseNumber);
    form.append("villageNo", formData.villageNo);
    form.append("subdistrict", formData.subdistrict);
    form.append("district", formData.district);
    form.append("province", formData.province);
    form.append("inspector", formData.inspector);  // ส่งแค่ _id ที่เก็บไว้

    formData.rounds.forEach((round, index) => {
      form.append(`roundNo[${index}]`, round.roundNo);
      form.append(`stepTest[${index}]`, round.stepTest);
      form.append(`value[${index}]`, round.value);
    });

    images.forEach((file) => form.append("images", file));

    try {
      const res = await stepTesstService.createStepTest(form);
      console.log(res)
      Swal.fire({
        title: "Success!",
        text: res.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate("/employee/step-test"));
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.res?.data?.msg || "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container py-4">
      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        <div className="card mb-4">
          <div className="card-header">ข้อมูลเบื้องต้น</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="dma" className="form-label">
                  ชื่อผู้ตรวจสอบ
                </label>
                <input type="hidden" name="inspector" value={formData.inspector} />
                <input
                  type="text"
                  className="form-control"
                  name="inspector"
                  placeholder="inspector"
                  value={`${userInfo.title} ${userInfo.firstName} ${userInfo.lastName}`}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  วันที่
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="dma" className="form-label">
                  DMA
                </label>
                <select
                  className="form-control"
                  id="dma"
                  name="dma"
                  value={formData.dma}
                  onChange={(e) => setFormData({ ...formData, dma: e.target.value })}
                  required
                >
                  <option value="">เลือก DMA</option>
                  {[...Array(10).keys()].map((i) => (
                    <option key={i} value={`0${i + 1}`}>
                      {`0${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6">
                <label htmlFor="houseNumber" className="form-label">
                  บ้านเลขที่
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="houseNumber"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="villageNo" className="form-label">
                  หมู่ที่
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="villageNo"
                  name="villageNo"
                  value={formData.villageNo}
                  onChange={(e) => setFormData({ ...formData, villageNo: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="subdistrict" className="form-label">
                  ตำบล
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="subdistrict"
                  name="subdistrict"
                  value={formData.subdistrict}
                  onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="district" className="form-label">
                  อำเภอ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="district"
                  name="district"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="province" className="form-label">
                  จังหวัด
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* step test */}
        <div className="card mb-4">
          <div className="card-header">
            Step Test Details{" "}
            <button
              type="button"
              onClick={handleAddRound}
              className="btn btn-sm btn-primary ms-3"
            >
              Add Step
            </button>
          </div>
          <div className="card-body">
            {formData.rounds.map((step, index) => (
              <div key={index} className="row g-3 align-items-center mb-3">
                <div className="col-md-4">
                  <label htmlFor={`stepTest-${index}`} className="form-label">Step Test</label>
                  <select
                    className="form-control"
                    id={`stepTest-${index}`}
                    name="stepTest" // กำหนด name ตรงกับ key ใน formData
                    value={step.stepTest}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  >
                    <option value="">Select</option>
                    {stepTestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                {/* <div className="col-md-3">
                  <label htmlFor={`roundNo-${index}`} className="form-label">Round No.</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`roundNo-${index}`}
                    name="roundNo" // กำหนด name หากจำเป็น (ในที่นี้ไม่จำเป็นเพราะ readOnly)
                    value={step.roundNo}
                    readOnly
                  />
                </div> */}

                <div className="col-md-3">
                  <label htmlFor={`roundNo-${index}`} className="form-label">Round No.</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`roundNo-${index}`}
                    name="roundNo" 
                    value={step.roundNo}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
                <div className="col-md-3">
                  <label htmlFor={`value-${index}`} className="form-label">Value</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`value-${index}`}
                    name="value" // กำหนด name ตรงกับ key ใน formData
                    value={step.value}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                  />
                </div>
                <div className="col-md-2 text-end">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleRemoveRound(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* uplodd images */}
        <div className="card mb-4">
          <div className="card-header">Upload Images</div>
          <div className="card-body">
            <input type="file" multiple accept="image/jpeg, image/png" onChange={handleFileChange} />
            <div className="row mt-3">
              {previewImages.map((url, index) => (
                <div key={index} className="col-md-3 mb-3 text-center">
                  <img src={url} alt="Preview" className="img-thumbnail" />
                  <button
                    type="button"
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() => removePreviewImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึก"}
        </button>
      </form>
    </div>
  )
}

export default CreateStepTest