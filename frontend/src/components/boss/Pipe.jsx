import React, { useEffect, useState } from "react";
import pipeService from "./../../service/pipeService";
import { Modal, Button, Form } from "react-bootstrap"; // Bootstrap modal

const Pipe = () => {
  const [pipes, setPipes] = useState([]);
  const [filteredPipe, setFilteredPipe] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false); // สำหรับ modal
  const [selectedPipe, setSelectedPipe] = useState(null); // pipe ที่จะอัปเดต

  const fetchPipe = async () => {
    try {
      const res = await pipeService.listPipe();
      setPipes(res.data.data);
      setFilteredPipe(res.data.data);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการดึงข้อมูลประเภทท่อ");
    }
  };

  useEffect(() => {
    fetchPipe();
  }, []);

  const handleEdit = (pipe) => {
    setSelectedPipe(pipe); 
    setIsModalOpen(true); 
  };

  const handleUpdatePipe = async () => {
    try {
      await pipeService.updatePipe(selectedPipe._id, selectedPipe);
      setPipes((prevPipes) =>
        prevPipes.map((pipe) =>
          pipe._id === selectedPipe._id ? { ...pipe, ...selectedPipe } : pipe
        )
      );
      setFilteredPipe((prevPipes) =>
        prevPipes.map((pipe) =>
          pipe._id === selectedPipe._id ? { ...pipe, ...selectedPipe } : pipe
        )
      );
      setIsModalOpen(false);
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
    }
  };

  const handleDelete = async (pipe) => {
    try {
      await pipeService.deletePipe(pipe._id);
      setPipes((prevPipes) => prevPipes.filter((p) => p._id !== pipe._id));
      setFilteredPipe((prevPipes) =>
        prevPipes.filter((p) => p._id !== pipe._id)
      );
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedPipe((prevPipe) => ({ ...prevPipe, [name]: value }));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredPipe.length / itemsPerPage))
    );
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPipes = filteredPipe.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPipe.length / itemsPerPage);

  return (
    <div className="tb-content mt-3">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-bordered table-gray table-striped text-center">
          <thead className="table-primary">
            <tr>
              <th scope="col">#</th>
              <th scope="col">ประเภทท่อ</th>
              <th scope="col">จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {currentPipes.length > 0 ? (
              currentPipes.map((pipe, index) => (
                <tr key={pipe._id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{pipe.pipe}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(pipe)}
                    >
                      แก้ไข
                    </button>{" "}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(pipe)}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">ไม่พบข้อมูล</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredPipe.length > 0 && (
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-end">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={handlePreviousPage}>
                ก่อนหน้า
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
                ถัดไป
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal สำหรับแก้ไข */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขประเภทท่อ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPipe && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>ชื่อประเภทท่อ</Form.Label>
                <Form.Control
                  type="text"
                  name="pipe"
                  value={selectedPipe.pipe || ""}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleUpdatePipe}>
            บันทึกการเปลี่ยนแปลง
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Pipe;
