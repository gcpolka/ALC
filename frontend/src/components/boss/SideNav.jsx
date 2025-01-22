import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import userService from '../../service/userService'
import Swal from 'sweetalert2'

const SideNav = () => {
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate()

    const handleLogout = () => {
        Swal.fire({
            icon: 'warning',
            title: 'แน่ใจแล้วหรอที่จะออกจากระบบ',
            showCancelButton: true,
            confirmButtonText: 'กดเพื่อออกจากระบบ',
            cancelButtonText: 'กดยกเลิกยังไม่แน่ใจ'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('token')
                Swal.fire({
                    icon: 'success',
                    title: 'ออกจากระบบสำเร็จ',
                    text: 'แล้วเจอกันใหม่สวัสดี',
                    timer: 1000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                })
                navigate('/')
            }
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await userService.userInfo()
                setUserInfo(res.data.data)
            } catch (error) {
                console.error("Error fetching user info:", error)
            }
        }
        fetchData()
    }, [])

    return (
        <div>
            <aside className="main-sidebar sidebar-dark-primary elevation-4" style={styles.sidebar}>
                <div className="sidebar">
                    {userInfo && (
                        <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
                            <div className="info text-center" style={{ width: '100%' }}>
                                <h5 className="fw-bold text-white mb-0 fs-3">
                                    {userInfo.title} {userInfo.firstName} {userInfo.lastName}
                                </h5>
                                <p className="text-white-50 small mb-1 fs-6">สถานะ:
                                    <span className="badge bg-success ms-1">
                                        {userInfo.role}
                                    </span>
                                </p>
                            </div>
                        </div>
                    )}
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <NavLink to='/boss/dashboard' className="nav-link">
                                    <i className="nav-icon fas fa-tachometer-alt" />
                                    <p>แดชบอร์ด</p>
                                </NavLink>
                            </li>
                            <li className="nav-header" style={styles.navHeader}>จัดการระบบ</li>
                            <li className="nav-item">
                                <NavLink to='/boss/case' className="nav-link" style={styles.navLink}>
                                    <i className="nav-icon fa fa-table" style={styles.navIcon} />
                                    <p>รายละเอียดจุดท่อรั่ว</p>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/boss/step-test' className="nav-link" style={styles.navLink}>
                                    <i className="nav-icon fab fa fa-table" style={styles.navIcon} />
                                    <p>Step Test</p>
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to='/boss/pipe' className="nav-link" style={styles.navLink}>
                                    <i className="nav-icon fab fa fa-table" style={styles.navIcon} />
                                    <p>ประเภทท่อ</p>
                                </NavLink>
                            </li>
                            <li className="nav-header" style={styles.navHeader}>จัดการข้อมูล</li>
                            <li className="nav-item">
                                <NavLink to='/boss/profile' className="nav-link" style={styles.navLink}>
                                    <i className="nav-icon 	fas fa-user-circle" style={styles.navIcon} />
                                    <p>ข้อมูลส่วนตัว</p>
                                </NavLink>
                            </li>
                            <li className="nav-header" style={styles.navHeader}>ออกจากระบบ</li>
                            <li className="nav-item">
                                <div onClick={handleLogout} className="nav-link" style={styles.navLink}>
                                    <i className="nav-icon far fa-circle text-danger" style={styles.navIcon} />
                                    <p className="text">ออกจากระบบ</p>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside >
        </div >
    )
}

export default SideNav

const styles = {
    sidebar: {
        background: 'linear-gradient(to right, #1e3c72, #2a5298)',
        color: 'white',
        minHeight: '100vh',
    },
    navLink: {
        color: 'white',
        transition: 'background 0.3s ease, color 0.3s ease',
        padding: '10px 20px',
        textDecoration: 'none'
    },
    navLinkHover: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        color: '#ffffff'
    },
    navIcon: {
        marginRight: '8px'
    },
    navHeader: {
        color: '#ffffff',
        padding: '10px 20px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
    },
    userInfo: {
        color: '#ffffff'
    },
}