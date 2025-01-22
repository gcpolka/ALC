import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import stepTesstService from "../../../service/stepTestService";
import Swal from "sweetalert2";

const EditStepTest = () => {
  const [formData, setFormData] = useState({
    date: "",
    dma: "",
    houseNumber: "",
    villageNo: "",
    subdistrict: "",
    district: "",
    province: "",
    rounds: [], // Step rounds
    images: [], // Uploaded files
    inspector: "", // Inspector ID
  });
  const [previewImages, setPreviewImages] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const stepTestOptions = ["CV", "SCV"];

  useEffect(() => {
    if (id) {
      fetchStepTestById(id);
    }
  }, [id]);

  const fetchStepTestById = async (id) => {
    try {
      const res = await stepTesstService.stepTestById(id);
      const fetchedData = res.data.data;

      // ตรวจสอบรูปแบบวันที่ก่อนที่จะแสดงผล
      const formattedDate = new Date(fetchedData.date)
        .toISOString()
        .split("T")[0];

      setFormData({
        ...fetchedData,
        date: formattedDate, // กำหนดค่าให้กับ formData
      });
    } catch (error) {
      console.error("Error fetching step test data:", error);
    }
  };

  // // Handle adding a new round
  // const handleAddRound = () => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     rounds: [
  //       ...prevState.rounds,
  //       { stepTest: "", roundNo: prevState.rounds.length + 1, value: "" },
  //     ],
  //   }));
  // };

  // Handle adding a new round
  const handleAddRound = () => {
    setFormData((prevState) => ({
      ...prevState,
      rounds: [
        ...prevState.rounds,
        { stepTest: "", roundNo: "", value: "" },
      ],
    }));
  };

  // Handle removing a round
  const handleRemoveRound = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      rounds: prevState.rounds.filter((_, i) => i !== index),
    }));
  };

  // Handle input changes for rounds
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRounds = [...formData.rounds];
    updatedRounds[index][name] = value;
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
        title: "Invalid Files!",
        text: "Ensure all files are JPEG/PNG and less than 5MB.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setFormData({
      ...formData,
      images: validFiles,
    });
    setPreviewImages(validFiles.map((file) => URL.createObjectURL(file)));
  };

  // Remove image preview
  const removePreviewImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setFormData({ ...formData, images: updatedImages });
  };

  // Handle submit for editing the step test
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("date", formData.date);
    form.append("dma", formData.dma);
    form.append("houseNumber", formData.houseNumber);
    form.append("villageNo", formData.villageNo);
    form.append("subdistrict", formData.subdistrict);
    form.append("district", formData.district);
    form.append("province", formData.province);
    form.append("inspector", formData.inspector._id);

    formData.rounds.forEach((round, index) => {
      form.append(`roundNo[${index}]`, round.roundNo);
      form.append(`stepTest[${index}]`, round.stepTest);
      form.append(`value[${index}]`, round.value);
    });

    formData.images.forEach((file) => form.append("images", file));

    try {
      const res = await stepTesstService.updateStepTest(id, form);
      Swal.fire({
        title: "Success!",
        text: res.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate("/admin/step-test"));
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.res?.data?.msg || "An unexpected error occurred.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <div className="container py-4">
      <form onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
        {/* Form fields */}
        <div className="card mb-4">
          <div className="card-header">ข้อมูลเบื้องต้น</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-12">
                <label htmlFor="dma" className="form-label">
                  ชื่อผู้ตรวจสอบ
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="inspector"
                  name="inspector"
                  value={`${formData.inspector.title || ""}${formData.inspector.firstName} ${formData.inspector.lastName}`}
                  onChange={(e) =>
                    setFormData({ ...formData, inspector: e.target.value })
                  }
                  required
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
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, dma: e.target.value })
                  }
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
              {/* Additional fields for houseNumber, villageNo, subdistrict, district, and province */}
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
                  onChange={(e) =>
                    setFormData({ ...formData, houseNumber: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, villageNo: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, subdistrict: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
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
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step Test */}
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
                  <label htmlFor={`stepTest-${index}`} className="form-label">
                    Step Test
                  </label>
                  <select
                    className="form-control"
                    id={`stepTest-${index}`}
                    name="stepTest"
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
                  <label htmlFor={`roundNo-${index}`} className="form-label">
                    Round No.
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id={`roundNo-${index}`}
                    name="roundNo"
                    value={step.roundNo}
                    readOnly
                  />
                </div> */}
                 <div className="col-md-3">
                  <label htmlFor={`roundNo-${index}`} className="form-label">
                    Round No.
                  </label>
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
                  <label htmlFor={`value-${index}`} className="form-label">
                    Value
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id={`value-${index}`}
                    name="value"
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

        <div className="card mb-4">
          <div className="card-header">Upload Images</div>
          <div className="card-body">
            {/* แสดงรูปเก่าที่มีอยู่แล้ว */}
            {formData.images.length > 0 && (
              <div className="row mt-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="col-md-3 mb-3 text-center">
                    {/* แสดงรูปเก่า */}
                    <img
                      src={`http://localhost:8080${image}`}
                      alt="Old Image"
                      className="img-thumbnail"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* แสดงรูปใหม่ที่ผู้ใช้เลือก */}
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
            <div className="row mt-3">
              {previewImages.map((url, index) => (
                <div key={index} className="col-md-3 mb-3 text-center">
                  {/* แสดงรูปที่ถูกเลือกใหม่ */}
                  <img src={url} alt="Preview" className="img-thumbnail" />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => removePreviewImage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-success">
          Save
        </button>
      </form>
    </div>
  );
};

export default EditStepTest;
