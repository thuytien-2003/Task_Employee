import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import EmployeePage from './pages/EmployeePage';
//import 'antd/dist/reset.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<EmployeePage />} />
            <Route path="/employees" element={<EmployeePage />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
