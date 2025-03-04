import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';

import Top from './components/layout/Top';
import MenuBar from './MenuBar';
import SignIn from './pages/SignIn.jsx';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CameraCapturePage from './pages/CameraCapturePage';
import ContactPage from './pages/ContactPage';
import MyPage from './pages/MyPage';
import EventPage from './pages/EventPage';
import SignUp from './pages/SignUp';
import SellerPage from './pages/saller-dashboard/SellerPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';

function App() {
  const [memberData, setMemberData] = useState(() => {
    return JSON.parse(localStorage.getItem('memberData')) || [];
  });

  useEffect(() => {
    if (memberData.length > 0) {
      localStorage.setItem('memberData', JSON.stringify(memberData));
    }
  }, [memberData]);

  function handleAdd(newMember) {
    setMemberData((prev) => [...prev, newMember]);
  }

  // 현재 경로 가져오기
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin', '/seller'); // `/admin`으로 시작하면 true

  return (
    <div className='flex'>
      {/* 관리자 페이지가 아닐 때만 MenuBar와 Top을 렌더링 */}
      {!isAdminPage && <MenuBar />}
      <div className={`flex-1 ${!isAdminPage ? 'ml-60' : ''}`}>
        {!isAdminPage && <Top />}
        <main className='main page'>
          <Routes>
            {/* 일반 페이지 */}
            <Route path='/' element={<HomePage memberData={memberData} onAdd={handleAdd} />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/contact' element={<ContactPage />} />
            <Route path='/event' element={<EventPage />} />
            <Route path='/camera' element={<CameraCapturePage onAdd={handleAdd} />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/mypage' element={<MyPage />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/productlist' element={<ProductListPage />} />
            <Route path='/seller' element={<SellerPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
