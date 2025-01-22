import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/auth/login'
import Register from './pages/auth/Register'
import AdminLayout from './layouts/AdminLayout';

import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDetailPage from './pages/admin/AdminDetailPage';
import AdminStepTespPage from './pages/admin/AdminStepTespPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';
import AdminCreateUserPage from './pages/admin/Form/AdminCreateUserPage';
import AdminEditUserPage from './pages/admin/Form/AdminEditUserPage';
import AdminPipePage from './pages/admin/AdminPipePage';
import AdminCreateCasePage from './pages/admin/Form/AdminCreateCasePage';
import AdminCaseDetail from './pages/admin/AdminCaseDetail';
import AdminEditCasePage from './pages/admin/Form/AdminEditCasePage';
import AdminCreateStepTestPage from './pages/admin/Form/AdminCreateStepTestPage';
import AdminEditStepTestPage from './pages/admin/Form/AdminEditStepTestPage';

import EmployeeLayout from './layouts/EmployeeLayout';
import GenPDF from './components/common/PDF/GenPDF';
import GenPDFCase from './components/common/PDF/GenPDFCase';
import EmployeeDashboardPage from './pages/employee/EmployeeDashboardPage';
import EmployeeDetailPage from './pages/employee/EmployeeDetailPage';
import EmployeeCaseDetailPage from './pages/employee/EmployeeCaseDetail';
import EmployeeCreateCasePage from './pages/employee/Form/EmployeeCreateCasePage';
import EmployeeEditCasePage from './pages/employee/Form/EmployeeEditCasePage';
import EmployeeStepTestPage from './pages/employee/EmployeeStepTestPage';
import EmployeeCreateStepTestPage from './pages/employee/Form/EmployeeCreateStepTestPage';
import EmployeeEditStepTest from './pages/employee/Form/EmployeeEditStepTest';
import EmployeeProfilePage from './pages/employee/EmployeeProfilePage';

import BossLayout from './layouts/BossLayout';
import BossDashboardPage from './pages/boss/BossDashboardPage';
import BossDetailPage from './pages/boss/BossDetailPage';
import BossCaseDetail from './pages/boss/BossCaseDetail';
import BossCreateCasePage from './pages/boss/Form/BossCreateCasePage';
import BossEditCasePage from './pages/boss/Form/BossEditCasePage';
import BossStepTespPage from './pages/boss/BossStepTespPage';
import BossCreateStepTestPage from './pages/boss/Form/BossCreateStepTestPage';
import BossEditStepTestPage from './pages/boss/Form/BossEditStepTestPage';
import BossPipePage from './pages/boss/BossPipePage';
import BossProfilePage from './pages/boss/BossProfilePage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/step-test/pdf/:id' element={<GenPDF />} />
        <Route path='/case/pdf/:id' element={<GenPDFCase />} />
        <Route element={<AdminLayout />} >
          <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
          <Route path='/admin/case' element={<AdminDetailPage />} />
          <Route path='/admin/case/detail/:id' element={<AdminCaseDetail />} />
          <Route path='/admin/case/create' element={<AdminCreateCasePage />} />
          <Route path='/admin/case/edit/:id' element={<AdminEditCasePage />} />
          <Route path='/admin/step-test' element={<AdminStepTespPage />} />
          <Route path='/admin/step-test/create' element={<AdminCreateStepTestPage />} />
          <Route path='/admin/step-test/edit/:id' element={<AdminEditStepTestPage />} />
          <Route path='/admin/pipe' element={<AdminPipePage />} />
          <Route path='/admin/user/create' element={<AdminCreateUserPage />} />
          <Route path='/admin/user' element={<AdminUserPage />} />
          <Route path='/admin/user/edit/:id' element={<AdminEditUserPage />} />
          <Route path='/admin/profile' element={<AdminProfilePage />} />
        </Route>
        <Route element={<BossLayout />} >
          <Route path='/boss/dashboard' element={<BossDashboardPage />} />
          <Route path='/boss/case' element={<BossDetailPage />} />
          <Route path='/boss/case/detail/:id' element={<BossCaseDetail />} />
          <Route path='/boss/case/create' element={<BossCreateCasePage />} />
          <Route path='/boss/case/edit/:id' element={<BossEditCasePage />} />
          <Route path='/boss/step-test' element={<BossStepTespPage />} />
          <Route path='/boss/step-test/create' element={<BossCreateStepTestPage />} />
          <Route path='/boss/step-test/edit/:id' element={<BossEditStepTestPage />} />
          <Route path='/boss/pipe' element={<BossPipePage />} />
          <Route path='/boss/profile' element={<BossProfilePage />} />
        </Route>
        <Route element={<EmployeeLayout />}>
          <Route path='/employee/dashboard' element={<EmployeeDashboardPage />} />
          <Route path='/employee/case' element={<EmployeeDetailPage />} />
          <Route path='/employee/case/detail/:id' element={<EmployeeCaseDetailPage />} />
          <Route path='/employee/case/create' element={<EmployeeCreateCasePage />} />
          <Route path='/employee/case/edit/:id' element={<EmployeeEditCasePage />} />
          <Route path='/employee/step-test' element={<EmployeeStepTestPage />} />
          <Route path='/employee/step-test/create' element={<EmployeeCreateStepTestPage />} />
          <Route path='/employee/step-test/edit/:id' element={<EmployeeEditStepTest />} />
          <Route path='/employee/profile' element={<EmployeeProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App