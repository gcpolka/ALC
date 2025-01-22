import React from 'react'
import Case from '../../components/admin/Case'

const AdminDetailPage = () => {
    return (
        <div className='p-2'>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">รายละเอียดจุดท่อรั่ว</h1>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">admin</a></li>
                                <li className="breadcrumb-item active">case</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            <Case />
        </div>
    )
}

export default AdminDetailPage