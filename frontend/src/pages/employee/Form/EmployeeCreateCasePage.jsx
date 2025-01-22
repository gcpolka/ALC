import React from 'react'
import CreateCase from '../../../components/employee/Form/CreateCase'

const EmployeeCreateCasePage = () => {
    return (
        <div className='p-2'>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">เพิ่มจุดท่อรั่ว</h1>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">employee</a></li>
                                <li className="breadcrumb-item active">case</li>
                                <li className="breadcrumb-item active">create</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            <CreateCase />
        </div>
    )
}

export default EmployeeCreateCasePage