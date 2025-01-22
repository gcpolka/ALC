import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import userService from './../../../service/userService';
import { useNavigate, useParams } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchuser = async () => {
        if (!id) {
            setError('User ID is not provided');
            return;
        }

        try {
            const res = await userService.userById(id);
            if (res.status === 200) {
                const user = res.data.data;
                setTitle(user.title || "");
                setFirstName(user.firstName || "");
                setLastName(user.lastName || "");
                setUsername(user.username || "");
                setPhone(user.phone || "");
                setRole(user.role || "");
            } else {
                setError('Error fetching user data');
            }
        } catch (error) {
            setError('Error fetching user data');
        }
    };

    useEffect(() => {
        fetchuser();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password && password !== confirmPassword) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "รหัสผ่านไม่ตรงกัน",
                showConfirmButton: false,
                timer: 1500
            });
            setLoading(false);
            return;
        }

        try {
            const updateduser = {
                title,
                firstName,
                lastName,
                username,
                phone,
                role,
                ...(password && { password })  // Only include password if it's provided
            };

            const update = await userService.updateUser(id, updateduser);
            if (update.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'User updated successfully.',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                   navigate('/admin/user');
                });
            } else {
                setError('Error updating user');
            }
        } catch (error) {
            setError('Error updating user');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/user');
    };

    return (
        <div className='form-update-user'>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group col-md-2">
                        <select
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        >
                            <option value="" disabled>เลือกคำนำหน้า</option>
                            <option value="นาย.">นาย.</option>
                            <option value="นาง.">นาง.</option>
                            <option value="น.ส.">น.ส.</option>
                            <option value="Mr.">Mr.</option>
                            <option value="Ms.">Ms.</option>
                        </select>
                    </div>
                    <div className="form-group col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="firstName"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <input
                            type="text"
                            className="form-control"
                            name="lastName"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-2">
                        <select
                            className="form-control"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="" disabled>สถานะ</option>
                            <option value="admin">แอดมิน</option>
                            <option value="boss">หัวหน้างาน</option>
                            <option value="employee">พนักงาน</option>
                        </select>
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <input
                            type="username"
                            className="form-control"
                            name="username"
                            placeholder="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <input
                            type="phone"
                            className="form-control"
                            name="phone"
                            placeholder="Phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <input
                            type="password"
                            className="form-control"
                            name="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <input
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <button type="button" className="btn btn-secondary mr-1" onClick={handleCancel} disabled={loading}>
                            ยกเลิก
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'กำลังแก้ไขข้อมูล...' : 'แก้ไขข้อมูล'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditUser;