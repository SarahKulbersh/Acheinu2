import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState } from 'react';
import { JobContext, EstPreviewContext, applyFormCardNumberContext, userIdContext } from './Context';
import "./styles/index.css"
import AllRoutes from './allRoutes';

function App() {
  const [job, setJob] = useState('');
  const [estPreview, setEstPreview] = useState(false);
  const [applyFormCardNumber, setApplyFormCardNumber] = useState(1)

  return <>
    <applyFormCardNumberContext.Provider value={{ applyFormCardNumber: applyFormCardNumber, setApplyFormCardNumber: setApplyFormCardNumber }}>
        <JobContext.Provider value={{ job: job, setJob: setJob }}>
          <EstPreviewContext.Provider value={{ estPreview: estPreview, setEstPreview: setEstPreview }}>
            <AllRoutes />
          </EstPreviewContext.Provider>
        </JobContext.Provider >
    </applyFormCardNumberContext.Provider>

  </>
}

export default App;
