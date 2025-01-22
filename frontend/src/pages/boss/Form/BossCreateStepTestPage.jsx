import React from "react";
import CreateStepTest from "../../../components/boss/Form/CreateStepTest";

const BossCreateStepTestPage = () => {
  return (
    <div className="p-2">
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Step Test</h1>
            </div>
            {/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">boss</a>
                </li>
                <li className="breadcrumb-item active">step test</li>
                <li className="breadcrumb-item active">create</li>
              </ol>
            </div>
            {/* /.col */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </div>
      <CreateStepTest />
    </div>
  );
};

export default BossCreateStepTestPage;
