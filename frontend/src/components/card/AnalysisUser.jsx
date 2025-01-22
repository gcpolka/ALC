import React, { useEffect, useState } from 'react'
import userService from './../../service/userService';
import caseService from './../../service/caseService';
import stepTesstService from './../../service/stepTestService';

const AnalysisUser = () => {
  const [userCount, setUserCount] = useState(0)
  const [caseCount, setCaseCount] = useState(0)
  const [stepTestCount, setStepTestCount] = useState(0)

  useEffect(()=>{
    const fetchUserCount = async () => {
      const res = await userService.userAll()
      setUserCount(res.data.data)
    }

    const fetchCaseCount = async () => {
      const res = await caseService.getCaseInfo()
      setCaseCount(res.data.data)
    }

    const fetchStepTestCount = async () => {
      const res = await stepTesstService.getStepTestInfo()
      setStepTestCount(res.data.data)
    }
    
    fetchUserCount()
    fetchCaseCount()
    fetchStepTestCount()
  },[])
  return (
    <div>
      <div className="row">
        {/* ./col */}
        <div className="col-lg-6 col-6">
          {/* small box */}
          <div className="small-box bg-success">
            <div className="inner">
              <h3>{caseCount.length}</h3>
              <p>จำนวนการแจ้งจุดท่อรั่ว</p>
            </div>
            <div className="icon">
              <i className="ion ion-stats-bars" />
            </div>
            <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
          </div>
        </div>
        {/* ./col */}
        <div className="col-lg-6 col-6">
          {/* small box */}
          <div className="small-box bg-warning">
            <div className="inner">
              <h3>{stepTestCount.length}</h3>
              <p>จำนวนการแจ้ง step test</p>
            </div>
            <div className="icon">
              <i className="ion ion-stats-bars" />
            </div>
            <a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right" /></a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisUser