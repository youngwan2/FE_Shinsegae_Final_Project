import { useState, useEffect } from 'react';
import { BrowserRouter as Routes, Route } from 'react-router-dom';
import './App.css';

import Top from './Top';
import MenuBar from './MenuBar';
import SignIn from './pages/SignIn.jsx';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import CameraCapturePage from './pages/CameraCapturePage';
import ContactPage from './pages/ContactPage';
import MyPage from './pages/MyPage';
import EventPage from './pages/EventPage';

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
    <div className='App'>
      <Top />
      <MenuBar />

      <Routes>
        <Route path='/' element={<HomePage memberData={memberData} onAdd={handleAdd} />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/event' element={<EventPage />} />
        <Route path='/camera' element={<CameraCapturePage onAdd={handleAdd} />} />
        <Route path='/signin' element={<SignIn />} />
        <Route path='/mypage' element={<MyPage />} />
      </Routes>
    </div>
  );
}

export default App;
