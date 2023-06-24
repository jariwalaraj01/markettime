import './App.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import SignUp from './pages/SignUp';

// public routes can access without any token or any restriction
const PublicRoute = ({ redirectPath = '/home' }) => {
  const auth = localStorage.getItem('token')
  if (auth) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

// protected routes can access with token only
const ProtectedRoute = ({ redirectPath = '/' }) => {
  const auth = localStorage.getItem('token')
  if (!auth) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <div>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path='/' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path='/home' element={<Home />} />
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
          {/*<Route path='*' element={<h1>Page not found 404!!!</h1>} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
