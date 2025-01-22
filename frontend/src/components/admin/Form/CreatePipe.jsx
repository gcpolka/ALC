import React, { useState } from 'react'
import Swal from 'sweetalert2';
import { Modal, Button, Form } from 'react-bootstrap';
import pipeService from './../../../service/pipeService';

const CreatePipe = () => {
  const [pipeData, setPipeData] = useState({ pipe: '' })
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setPipeData({ pipe: '' })
    setShow(false)
  };
  
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target
    setPipeData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    Swal.fire({
      title: 'กำลังสร้างเนื้อหา...',
      text: 'โปรดรอสักครู่',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      await pipeService.createPipe(pipeData);
      Swal.fire({
        icon: 'success',
        title: 'สร้างเนื้อหาเรียบร้อย',
        text: 'เนื้อหาของคุณถูกสร้างสำเร็จแล้ว!',
        confirmButtonText: 'ตกลง'
      }).then(() => {
        window.location.reload();
      });
      handleClose();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'มีปัญหาในการสร้างเนื้อหา',
        confirmButtonText: 'ลองอีกครั้ง'
      });
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        เพิ่มเนื้อหา
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>สร้างเนื้อหาใหม่</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="contentName">
              <Form.Label>ท่อ</Form.Label>
              <Form.Control
                type="text"
                name="pipe"
                value={pipeData.pipe}
                onChange={handleChange}
                placeholder="กรอกประเภทท่อ"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            ปิด
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'กำลังสร้างเนื้อหา...' : 'บันทึกการเปลี่ยนแปลง'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default CreatePipe