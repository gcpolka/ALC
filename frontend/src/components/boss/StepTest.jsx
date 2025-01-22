import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import stepTestService from "../../service/stepTestService";
import Swal from "sweetalert2";
import stepTesstService from "../../service/stepTestService";

const StepTest = () => {
  const [stepTests, setStepTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const [searchDma, setSearchDma] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedStepTest, setSelectedStepTest] = useState(null);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await stepTestService.listStepTest();
        setStepTests(res.data.data || []);
        // console.log(res.data.data);
      } catch (error) {
        console.error("Error fetching step tests:", error);
      }
    };
    fetchData();
  }, []);

  // Filter logic
  const filteredStepTests = stepTests.filter((item) => {
    const matchesDate = searchDate
      ? new Date(item.date).toLocaleDateString("en-CA") === searchDate
      : true;

    const matchesDma = searchDma
      ? item.dma && item.dma.toLowerCase().includes(searchDma.toLowerCase())
      : true;

    return matchesDate && matchesDma;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredStepTests.length / itemsPerPage);
  const indexOfLastStepTest = currentPage * itemsPerPage;
  const indexOfFirstStepTest = indexOfLastStepTest - itemsPerPage;
  const currentStepTests = filteredStepTests.slice(
    indexOfFirstStepTest,
    indexOfLastStepTest
  );

  // Event handlers
  const handleCreate = () => navigate("/admin/step-test/create");
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePageClick = (page) => setCurrentPage(page);

  const handleDowloadPDF = async (id) => {
    const pdfUrl = `/step-test/pdf/${id}`

    window.open(pdfUrl, '_blank');
  }

  const handleNextDetail = (id) => {
    const stepTest = stepTests.find((item) => item._id === id);
    setSelectedStepTest(stepTest);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/admin/step-test/edit/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await stepTesstService.deleteStepTest(id);
        setStepTests(stepTests.filter((stepTestItem) => stepTestItem._id !== id));

        Swal.fire({
          title: "ลบข้อมูลเรียบร้อยแล้ว",
          icon: "success",
        });
      }
    } catch (error) {
      console.error("Error deleting case:", error);

      Swal.fire({
        title: "เกิดข้อผิดพลาดในการลบข้อมูล",
        icon: "error",
      });
    }
  };

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="tb-stepTest">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-primary" onClick={handleCreate}>
          Add Step Test
        </button>
      </div>

      {/* Search Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="form-control"
            placeholder="Search by date"
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            value={searchDma}
            onChange={(e) => setSearchDma(e.target.value)}
            className="form-control"
            placeholder="Search by DMA"
          />
        </div>
      </div>

      {/* Step Test Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-primary">
            <tr>
              <th>#</th>
              <th>รายชื่อผู้ตรวจ</th>
              <th>วันที่</th>
              <th>DMA</th>
              <th>สถานที่</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentStepTests.length > 0 ? (
              currentStepTests.map((item, index) => (
                <tr key={item._id}>
                  <td>{indexOfFirstStepTest + index + 1}</td>
                  <td>{item.inspector?.title || ""}{item.inspector?.firstName || ""} {item.inspector?.lastName || ""}</td>
                  <td>
                    {new Date(item.date).toLocaleDateString("th-TH") || "-"}
                  </td>
                  <td>{item.dma || "-"}</td>
                  <td>
                    {`${item.houseNumber}, หมู่ ${item.villageNo}, ต.${item.subdistrict}, อ.${item.district}, จ.${item.province}`}
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm mx-1 mt-1"
                      onClick={() => handleNextDetail(item._id)}
                    >
                      รายละเอียด
                    </button>
                    <button
                      className="btn btn-info btn-sm mx-1 mt-1"
                      onClick={() => handleDowloadPDF(item._id)}
                      target="_blank"
                    >
                      Dowload PDF
                    </button>
                    <button
                      className="btn btn-warning btn-sm mx-1 mt-1"
                      onClick={() => handleEdit(item._id)}
                    >
                      แก้ไข
                    </button>
                    <button
                      className="btn btn-danger btn-sm mx-1 mt-1"
                      onClick={() => handleDelete(item._id)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">ไม่มีข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-end">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={handlePreviousPage}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, index) => (
            <li
              key={index}
              className={`page-item ${
                currentPage === index + 1 ? "active" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button className="page-link" onClick={handleNextPage}>
              Next
            </button>
          </li>
        </ul>
      </nav>

      {/* Modal for Details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียด Step Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStepTest ? (
            <>
              {/* ข้อมูลพื้นฐาน */}
              <p>
                <strong>ผู้ตรวจสอบ:</strong>{" "}
                {selectedStepTest.inspector?.title || ""}{selectedStepTest.inspector?.firstName || ""} {selectedStepTest.inspector?.lastName || ""}
              </p>
              <p>
                <strong>วันที่:</strong>{" "}
                {new Date(selectedStepTest.date).toLocaleDateString("th-TH")}
              </p>
              <p>
                <strong>DMA:</strong> {selectedStepTest.dma}
              </p>
              <p>
                <strong>สถานที่:</strong>{" "}
                {`${selectedStepTest.houseNumber}, หมู่ ${selectedStepTest.villageNo}, ต.${selectedStepTest.subdistrict}, อ.${selectedStepTest.district}, จ.${selectedStepTest.province}`}
              </p>

              {/* ข้อมูล Rounds */}
              <h5>ลำดับการตรวจ</h5>
              {selectedStepTest.rounds && selectedStepTest.rounds.length > 0 ? (
                <ul>
                  {selectedStepTest.rounds.map((round) => (
                    <li key={round._id.$oid}>
                      <strong>ลำดับที่ {round.roundNo}:</strong>{" "}
                      {round.stepTest} - ค่า: {round.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>ไม่มีข้อมูลลำดับการตรวจ</p>
              )}

              {/* ภาพ */}
              <h5>รูปภาพ</h5>
              <div className="d-flex flex-wrap">
                {selectedStepTest.images &&
                selectedStepTest.images.length > 0 ? (
                  selectedStepTest.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:8080${image}`}
                      alt={`Step Test ${index + 1}`}
                      className="img-thumbnail m-2"
                      style={{ width: "150px", height: "auto" }}
                    />
                  ))
                ) : (
                  <p>ไม่มีภาพ</p>
                )}
              </div>
            </>
          ) : (
            <p>ไม่มีข้อมูล</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StepTest;
