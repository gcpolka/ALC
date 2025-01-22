import React from 'react'
import CreatePipe from './../../components/boss/Form/CreatePipe';
import Pipe from './../../components/boss/Pipe';

const BossPipePage = () => {
    return (
        <div className='p-2'>
            <div className="content-header">
                <div className="container-fluid">
                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1 className="m-0">ประเภทท่อ</h1>
                        </div>{/* /.col */}
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="#">boss</a></li>
                                <li className="breadcrumb-item active">pipe</li>
                            </ol>
                        </div>{/* /.col */}
                    </div>{/* /.row */}
                </div>{/* /.container-fluid */}
            </div>
            <CreatePipe/>
            <Pipe />
        </div>
    )
}

export default BossPipePage