import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import authService from '../../service/authService';
import Swal from 'sweetalert2';
import logo from '../../assets/logo.png';

const Login = () => {
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const res = await authService.login(loginData);
            const userRole = res.data.data.role;
            localStorage.setItem("token", res.data.data.token);
    
            Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบ',
                text: 'ยินดีต้อนรับเข้าสู่ระบบ',
                timer: 1000,
                timerProgressBar: true,
                showConfirmButton: false,
            });
    
            // Navigate based on role using switch-case
            switch (userRole) {
                case 'admin':
                    navigate('/admin/dashboard');
                    break;
                case 'employee':
                    navigate('/employee/dashboard');
                    break;
                case 'boss':
                    navigate('/boss/dashboard');
                    break;
                default:
                    Swal.fire({
                        icon: 'warning',
                        title: 'เกิดข้อผิดพลาด!',
                        text: 'ไม่สามารถระบุบทบาทผู้ใช้ได้',
                        showConfirmButton: true,
                    });
            }
        } catch (error) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: "โปรดใส่ username และ password ให้ถูกต้อง",
                showConfirmButton: false,
                timer: 1000,
            });
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(to right, #1e3c72, #2a5298)',
                padding: '20px',
            }}
        >
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    background: '#fff',
                    borderRadius: '10px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    padding: '20px',
                    textAlign: 'center',
                }}
            >
                <img src={logo} alt="Logo" style={{ width: '100px', marginBottom: '20px' }} />
                <h3 style={{ marginBottom: '20px', color: '#333' }}>ระบบฐานข้อมูลการปฏิบัติงาน ALC</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '5px',
                                border: '1px solid #ccc',
                                fontSize: '16px',
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '10px',
                            background: loading ? '#ccc' : '#1e3c72',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.3s ease',
                        }}
                    >
                        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
