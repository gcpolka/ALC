import React from 'react'
import StepTest from '../../components/admin/StepTest'

const AdminStepTespPage = () => {
    return (
        <div className='p-2'>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">Step Test</h1>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">admin</a></li>
                                <li className="breadcrumb-item active">step test</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            <StepTest />
        </div>
    )
}

export default AdminStepTespPage