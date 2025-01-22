import React from 'react';
import CaseDay from '../chart/CaseDay';
import CaseWeek from '../chart/CaseWeek';
import CaseMonth from '../chart/CaseMonth';
import StepTestDay from '../chart/StepTestDay';
import StepTestWeek from './../chart/StepTestWeek';
import StepTestMonth from './../chart/StepTestMonth';
import AnalysisBoss from '../card/AnalysisBoss';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <section className="content">
        <div className="container-fluid">
          <AnalysisBoss />
          {/* Charts */}
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <CaseDay />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <CaseWeek />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <CaseMonth />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <StepTestDay />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <StepTestWeek />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <StepTestMonth />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>{/* /.content */}
    </div>
  );
};

export default Dashboard;
