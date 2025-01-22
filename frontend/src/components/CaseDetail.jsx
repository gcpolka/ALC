import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import caseService from "./../service/caseService";

const CaseDetail = () => {
  const { id } = useParams();
  const [caseDetail, setCaseDetail] = useState(null);

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        const response = await caseService.caseById(id);
        setCaseDetail(response.data.data);
      } catch (error) {
        console.error("Error fetching case detail:", error);
      }
    };

    fetchCaseDetail();
  }, [id]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyAsmDXCfNp6EVrsaRMj2okavlxRrty_oLE",
  });

  if (!isLoaded || !caseDetail) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      {/* ข้อมูลงาน */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-secondary">ข้อมูลงาน</h5>
          <span className={`badge ${caseDetail.status === "อนุมัติ" ? "bg-success" : "bg-warning"}`}>
            {caseDetail.status}
          </span>
        </div>
        <div className="row">
          <div className="col-md-4">
            <p><strong>วันที่:</strong> {new Date(caseDetail.date).toLocaleDateString("th-TH")}</p>
            <p><strong>หมายเลขงาน:</strong> {caseDetail.numberWork}</p>
          </div>
          <div className="col-md-4">
            <p><strong>สถานที่:</strong> {`${caseDetail.houseNumber}, หมู่ ${caseDetail.villageNo}, ต.${caseDetail.subdistrict}, อ.${caseDetail.district}, จ.${caseDetail.province}`}</p>
          </div>
          <div className="col-md-4">
            <p><strong>ชนิดท่อ:</strong> {caseDetail?.pipe?.pipe || "-"}</p>
            <p><strong>ขนาด:</strong> {caseDetail.size || "-"}</p>
          </div>
        </div>
      </div>

      {/* รูปภาพ */}
      <div className="mb-4">
        <h5 className="mb-3 text-secondary">รูปภาพ</h5>
        <div className="row">
          {caseDetail.images && caseDetail.images.length > 0 ? (
            caseDetail.images.map((image, index) => (
              <div key={index} className="col-md-3 mb-3">
                <img
                  src={`http://localhost:8080${image}`}
                  alt={`Case ${caseDetail.numberWork}`}
                  className="img-fluid rounded shadow-sm"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-muted">ไม่มีรูปภาพ</p>
            </div>
          )}
        </div>
      </div>

      {/* ตำแหน่ง */}
      <div className="mb-4">
        <h5 className="mb-3 text-secondary">ตำแหน่ง</h5>
        <div className="rounded shadow-sm" style={{ overflow: "hidden" }}>
          <GoogleMap
            id="map"
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={{ lat: caseDetail.latitude, lng: caseDetail.longitude }}
            zoom={12}
          >
            <Marker position={{ lat: caseDetail.latitude, lng: caseDetail.longitude }} />
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default CaseDetail;
