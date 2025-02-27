import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function MyPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('사용자 정보를 가져오지 못했습니다.');
      }

      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);
      setEmail(data.email);
      setPhone(data.phone);
      setAddress(data.address);
    } catch (error) {
      console.error('회원 정보 로드 오류:', error);
    }
  };

  // 회원 정보 업데이트
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, userName, email, phone }),
      });

      if (!response.ok) {
        throw new Error('회원 정보 수정 실패');
      }

      alert('회원 정보가 수정되었습니다!');
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
    }
  };

  return (
    <div className='mypage-container'>
      <h2>마이페이지</h2>
      <form onSubmit={handleUpdate} className='mypage-form'>
        <label>이름:</label>
        <input
          type='text'
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />

        <label>이메일:</label>
        <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>전화번호:</label>
        <input type='text' value={phone} onChange={(e) => setPhone(e.target.value)} />

        <label>주소:</label>
        <input type='text' value={address} onChange={(e) => setPhone(e.target.value)} />

        <button type='submit' className='update-btn'>
          정보 수정
        </button>
      </form>

      <button className='back-btn' onClick={() => navigate('/')}>
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default MyPage;
