import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import userService from './../service/userService';

const Profile = () => {
    const [formData, setFormData] = useState({
        title: '',
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userService.userInfo();
                console.log(response.data.data)
                setFormData({
                    title: response.data.data.title || '',
                    firstName: response.data.data.firstName || '',
                    lastName: response.data.data.lastName || '',
                    username: response.data.data.username || '',
                    password: '', // Don't populate password for security reasons
                    phone: response.data.data.phone || ''
                });
            } catch (error) {
                Swal.fire('Error', 'Error fetching user data.', 'error');
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await userService.updateProfile(formData);
            if (response.status === 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Profile updated successfully.',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                }).then(() => {
                    window.location.reload();
                });
            } else {
                Swal.fire('Error', 'Error updating user.', 'error');
            }
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Error updating profile.', 'error');
        }
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Title:</label>
                            <select
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
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
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label>First Name:</label>
                            <input
                                type="text"
                                name="firstName"
                                className="form-control"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <label>Last Name:</label>
                            <input
                                type="text"
                                name="lastName"
                                className="form-control"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                name="phone"
                                className="form-control"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="form-group">
                            <label>username:</label>
                            <input
                                type="username"
                                name="username"
                                className="form-control"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="row mt-3">
                    <div className="col-md-12">
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter new password if changing"
                            />
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary mt-4">แก้ไขข้อมูล</button>
            </form>
        </div>
    );
};

export default Profile;