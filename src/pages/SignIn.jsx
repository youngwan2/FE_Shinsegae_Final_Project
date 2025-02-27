import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
function SignIn() {
  console.log('SignIn 컴포넌트 렌더링됨'); // ✅ 확인용 로그 추가
  const location = useLocation();

  const [userName, setUserName] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('/');

  // 로그인 후 리디렉션될 URL을 서버에서 가져오기
  const getRedirectUrl = async () => {
    try {
      console.log('리디렉션 URL 가져오는 중...'); // ✅ 확인용 로그 추가
      const response = await fetch('http://localhost:5000/get-redirect-url', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('서버에서 리디렉션 URL을 가져오지 못함');
      }

      const data = await response.json();
      console.log('가져온 리디렉션 URL:', data.redirectUrl); // ✅ 확인용 로그 추가
      setRedirectUrl(data.redirectUrl);
    } catch (error) {
      console.error('리디렉션 URL 가져오기 실패:', error);
    }
  };

  useEffect(() => {
    console.log('SignIn useEffect 실행됨'); // ✅ 확인용 로그 추가
    getRedirectUrl();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const userName = params.get('userName');

    console.log('URL Params:', { userId, userName }); // ✅ 확인용 로그 추가

    if (userId && userName) {
      setUserName(userName);
    }
  }, [location.search]);

  const handleKakaoLogin = () => {
    window.location.href = `http://localhost:5000/kakao?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleNaverLogin = () => {
    const redirectUri = 'http://localhost:5000/naver/callback';
    const clientId = 'FZkzMCrtIuOaZdWdc0Hx';
    const state = Math.random().toString(36).substring(2, 15);

    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&redirect=${encodeURIComponent(redirectUrl)}`;
    window.location.href = naverAuthUrl;
  };

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5000/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <div className='signin-container'>
      <h1>소셜 로그인</h1>
      <button onClick={handleKakaoLogin} className='login-btn'>
        카카오 로그인
      </button>
      <button onClick={handleNaverLogin} className='login-btn'>
        네이버 로그인
      </button>
      <button onClick={handleGoogleLogin} className='login-btn'>
        구글 로그인
      </button>

      {userName && <div className='topbar'>환영합니다, {userName}님!</div>}
    </div>
  );
}

export default SignIn;
