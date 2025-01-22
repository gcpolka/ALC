import React from 'react';
import StepTestMonthUser from '../chart/StepTestMonthUser';
import StepTestWeekUser from '../chart/StepTestWeekUser';
import StepTestDayUser from '../chart/StepTestDayUser';
import CaseMonthUser from '../chart/CaseMonthUser';
import CaseWeekUser from '../chart/CaseWeekUser';
import CaseDayUser from '../chart/CaseDayUser';
import AnalysisUser from './../card/AnalysisUser';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <section className="content">
        <div className="container-fluid">
          <AnalysisUser />
          {/* Charts */}
          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <CaseDayUser />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <CaseWeekUser />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <CaseMonthUser />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <StepTestDayUser />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <StepTestWeekUser />
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <StepTestMonthUser />
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
