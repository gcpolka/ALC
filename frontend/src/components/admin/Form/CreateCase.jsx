import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import pipeService from "./../../../service/pipeService";
import caseService from "./../../../service/caseService";
import userService from "../../../service/userService";

const CreateCase = () => {
  const [formData, setFormData] = useState({
    date: "",
    numberWork: "",
    houseNumber: "",
    villageNo: "",
    subdistrict: "",
    district: "",
    province: "",
    latitude: "",
    longitude: "",
    pipe: "",
    size: "",
    dma: "",
    inspector: "",
    images: [],
    status: "รอการตรวจสอบ",
  });
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [pipes, setPipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 13.7367, lng: 100.5232 }); // Default to Bangkok
  const [currentLocation, setCurrentLocation] = useState(null);

  const navigate = useNavigate();

  const sizePipeOption = [20, 25, 40, 50, 110, 150, 200, 225, 300]

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const currentPos = { lat: latitude, lng: longitude };
        setMapCenter(currentPos);
        setCurrentLocation(currentPos);
      },
      (error) => {
        console.error("Error getting location:", error);
        Swal.fire({
          title: "Error!",
          text: "ไม่สามารถระบุตำแหน่งปัจจุบันได้ แสดงตำแหน่งเริ่มต้นที่กรุงเทพฯ",
          icon: "warning",
          confirmButtonText: "ตกลง",
        });
      }
    );
  }, []);

  useEffect(() => {
    const fetchPipes = async () => {
      try {
        const res = await pipeService.listPipe();
        setPipes(res.data.data);
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.msg || "Failed to fetch pipe data.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    };

    const fetchUserInfo = async () => {
      try {
        const res = await userService.userInfo();
        setUserInfo(res.data.data);
        setFormData((prevData) => ({
          ...prevData,
          inspector: res.data.data._id, // เก็บแค่ _id
        }));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.res?.data?.msg || "An unexpected error occurred.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchPipes();
    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        title: "ไฟล์ไม่ถูกต้อง!", // ชื่อในกล่องแจ้งเตือน
        text: "กรุณาเลือกไฟล์ที่เป็น JPEG/PNG และมีขนาดไม่เกิน 5MB.", // ข้อความแจ้งเตือน
        icon: "error", // ไอคอนการแจ้งเตือน
        confirmButtonText: "ตกลง", // ข้อความในปุ่มตกลง
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
    if (!formData.latitude || !formData.longitude) {
      Swal.fire({
        title: "Error!",
        text: "Please select a location on the map.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setLoading(true);

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    images.forEach((file) => formDataToSend.append("images", file));

    try {
      const response = await caseService.createCase(formDataToSend);
      Swal.fire({
        title: "Success!",
        text: response.data.msg,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => navigate("/admin/case"));
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.msg || "An unexpected error occurred.",
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
              {/* Inspector Information */}
              <div className="col-md-12">
                <label htmlFor="inspector" className="form-label">
                  ชื่อผู้ตรวจสอบ
                </label>
                <input
                  type="hidden"
                  name="inspector"
                  value={formData.inspector._id}
                />
                <input
                  type="text"
                  className="form-control"
                  name="inspector"
                  placeholder="ชื่อผู้ตรวจสอบ"
                  value={`${userInfo.title || ""} ${userInfo.firstName} ${userInfo.lastName
                    }`}
                  disabled
                />
              </div>

              {/* Row 1: Date and Work Number */}
              <div className="col-md-6">
                <label htmlFor="date" className="form-label">
                  วันที่ <i className="bi bi-calendar"></i>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="numberWork" className="form-label">
                  เลขที่งาน <i className="bi bi-file-earmark"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="numberWork"
                  name="numberWork"
                  value={formData.numberWork}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 2: Address Fields */}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-header">รายละเอียดจุดท่อรั่ว</div>
          <div className="card-body">
            <div className="row g-3">
              {/* Row 3: Pipe and Size */}
              <div className="col-md-4">
                <label htmlFor="pipe" className="form-label">
                  ท่อ
                </label>
                <select
                  className="form-control"
                  id="pipe"
                  name="pipe"
                  value={formData.pipe}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    -- เลือกประเภทท่อ --
                  </option>
                  {pipes?.map((pipe) => (
                    <option key={pipe._id} value={pipe._id}>
                      {pipe.pipe}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="size" className="form-label">
                  ขนาด
                </label>
                {/* <input
                  type="text"
                  className="form-control"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                /> */}
                <select
                  className="form-control"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  {sizePipeOption.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
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

              {/* Row 4: Latitude and Longitude */}
              <div className="col-md-6">
                <label htmlFor="latitude" className="form-label">
                  ละติจูด <i className="bi bi-geo"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="longitude" className="form-label">
                  ลองจิจูด <i className="bi bi-geo-alt"></i>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mt-3 mb-3">
                <LoadScript googleMapsApiKey="AIzaSyAsmDXCfNp6EVrsaRMj2okavlxRrty_oLE">
                  <GoogleMap
                    id="map"
                    mapContainerStyle={{ width: "100%", height: "400px" }}
                    center={mapCenter}
                    zoom={15}
                    onClick={(e) => {
                      setFormData({
                        ...formData,
                        latitude: e.latLng.lat().toFixed(6),
                        longitude: e.latLng.lng().toFixed(6),
                      });
                    }}
                  >
                    {/* Selected Location Marker */}
                    {formData.latitude && formData.longitude && (
                      <Marker
                        position={{
                          lat: parseFloat(formData.latitude),
                          lng: parseFloat(formData.longitude),
                        }}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }}
                        title="ตำแหน่งที่เลือก"
                      />
                    )}

                    {/* Current Location Marker */}
                    {currentLocation && (
                      <Marker
                        position={currentLocation}
                        icon={{
                          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                        }}
                        title="ตำแหน่งปัจจุบัน"
                      />
                    )}
                  </GoogleMap>
                </LoadScript>
              </div>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="card mb-12">
          <div className="card-header">Upload Images</div>
          <div className="card-body">
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png"
              onChange={handleFileChange}
            />
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
  );
};

export default CreateCase;
