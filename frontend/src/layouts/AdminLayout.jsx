import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import SideNav from '../components/admin/SideNav'
import Header from '../components/Header'

const AdminLayout = () => {
    return (
        <div className='wrapper'>
            <Header />
            <SideNav />
            <div className="content-wrapper">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default AdminLayout