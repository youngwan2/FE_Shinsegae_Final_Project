import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ProductListPage from './pages/ProductListPage';
import SignUp from './pages/SignUp';

function App() {
  // localStorage에서 초기 데이터 불러오기
  const [memberData, setMemberData] = useState(() => {
    return JSON.parse(localStorage.getItem('memberData')) || [];
  });

  // memberData 변경될 때 localStorage 업데이트
  useEffect(() => {
    if (memberData.length > 0) {
      localStorage.setItem('memberData', JSON.stringify(memberData));
    }
  }, [memberData]);

  // 새로운 멤버 추가 함수
  function handleAdd(newMember) {
    setMemberData((prev) => [...prev, newMember]);
  }

  return (
    <div className="flex">
      {/* 왼쪽 고정 메뉴바 */}
      <MenuBar />
  
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 ml-60">
        {/* 상단 네비게이션 바 */}
        <Top />
  
        {/* 스크롤 가능한 컨텐츠 영역 */}
        <main className="main page">
          <Routes>
            <Route path="/" element={<HomePage memberData={memberData} onAdd={handleAdd} />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/event" element={<EventPage />} />
            <Route path="/camera" element={<CameraCapturePage onAdd={handleAdd} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/signup" element={<SignUp />} /> {/* ✅ 회원가입 경로 추가 */}
            <Route path="/cart" element={<CartPage />} /> 
            <Route path="/productlist" element={<ProductListPage />} /> 
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;