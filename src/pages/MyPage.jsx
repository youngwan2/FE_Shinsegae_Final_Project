import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function MyPage() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['']);
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  // 사용자 정보 가져오기
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: "GET",
        credentials: "include", // 세션 유지 필수
      });

   
      if (!response.ok) {
        throw new Error("로그인 정보 조회 실패");
      }
      const data = await response.json();
      setUserId(data.user_id);
      setUserName(data.userName); // 세션에서 받아온 값 사용
      setEmails(data.emails || ['']);
      setPhones(data.phones || ['']);
      setAddress(data.address);
    } catch (error) {
      console.error('회원 정보 로드 오류:', error);
    }
  };

  // 회원 정보 업데이트
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/auth/update-user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, emails, phones, address }),
      });

      if (!response.ok) {
        throw new Error('회원 정보 수정 실패');
      }

      alert('회원 정보가 수정되었습니다!');
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
    }
  };

  const addEmailField = () => setEmails([...emails, '']);
  const addPhoneField = () => setPhones([...phones, '']);

  const updateEmail = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const updatePhone = (index, value) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  return (
    <div className='mypage-container'>
      <h2>마이페이지</h2>
      <form onSubmit={handleUpdate} className='mypage-form'>
        <label>이름:</label>
        <input
          type='text'
          value={userName}
          disabled
        />

        <label>이메일:</label>
        {emails.map((email, index) => (
          <input
            key={index}
            type='email'
            value={email}
            onChange={(e) => updateEmail(index, e.target.value)}
            required
          />
        ))}
        <button type='button' onClick={addEmailField}>이메일 추가</button>

        <label>전화번호:</label>
        {phones.map((phone, index) => (
          <input
            key={index}
            type='text'
            value={phone}
            onChange={(e) => updatePhone(index, e.target.value)}
          />
        ))}
        <button type='button' onClick={addPhoneField}>전화번호 추가</button>

        <label>주소:</label>
        <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} />

        <button type='submit' className='update-btn'>
          정보 수정
        </button>
      </form>

      <button className='back-btn' onClick={() => navigate('/')}>홈으로 돌아가기</button>
    </div>
  );
}

export default MyPage;