import React, { useEffect, useState } from 'react'
import caseService from './../../service/caseService';
import stepTesstService from './../../service/stepTestService';

const AnalysisBoss = () => {
  const [caseCount, setCaseCount] = useState(0)
  const [stepTestCount, setStepTestCount] = useState(0)

  useEffect(()=>{
    const fetchCaseCount = async () => {
      const res = await caseService.listCase()
      setCaseCount(res.data.data)
    }

    const fetchStepTestCount = async () => {
      const res = await stepTesstService.listStepTest()
      setStepTestCount(res.data.data)
    }

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

export default AnalysisBoss