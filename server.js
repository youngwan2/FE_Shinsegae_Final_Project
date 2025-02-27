import express from 'express';
import axios from 'axios';
import FormData from 'form-data';
import cors from 'cors';
import bodyParser from 'body-parser';
import qs from 'qs';
import session from 'express-session';

const app = express();
const PORT = 5000;

const NAVER_CLIENT_ID = 'FZkzMCrtIuOaZdWdc0Hx';
const NAVER_CLIENT_SECRET = '6cUn_3AnDm';
const NAVER_REDIRECT_URI = 'http://localhost:5000/naver/callback';

const KAKAO_CLIENT_ID = '6cec803636734cf1381018cd02a8a18c';
const KAKAO_REDIRECT_URI = 'http://localhost:5000/kakao/callback';

app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // ✅ 허용할 프론트엔드 주소 추가
    methods: ['GET', 'POST', 'PUT', 'DELETE'],

    credentials: true,
  }),
);

app.use(bodyParser.json({ limit: '10mb' }));

const FACEPP_API_KEY = 'Sz1GU30evsK2-grMiFk7U7UifpYHRgAX';
const FACEPP_API_SECRET = 'BsZfTLsRoWX7A_Rl0QGIXFTP8JCTZ3bt';
const FACESET_OUTER_ID = 'user_faceset_01';

// 얼굴 감지 (face_token 얻기)
const detectFace = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append('api_key', FACEPP_API_KEY);
    formData.append('api_secret', FACEPP_API_SECRET);
    formData.append('image_base64', imageData);

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/detect',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    if (response.data.faces && response.data.faces.length > 0) {
      return response.data.faces[0].face_token;
    } else {
      throw new Error('얼굴을 감지할 수 없습니다.');
    }
  } catch (error) {
    throw new Error(error.response?.data?.error_message || error.message);
  }
};
//얼굴검색
const searchFaceInFaceSet = async (imageData) => {
  try {
    const formData = new FormData();
    formData.append('api_key', FACEPP_API_KEY);
    formData.append('api_secret', FACEPP_API_SECRET);
    formData.append('outer_id', FACESET_OUTER_ID);
    formData.append('image_base64', imageData);

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/search',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    const userId = response.data.results[0]?.user_id;

    console.log(userId); // "재훈"

    if (response.data.faces && response.data.faces.length > 0) {
      console.log('등록된얼굴발견!', response.data.faces[0].face_token);
      return userId;
    } else {
      throw new Error('해당 얼굴을 찾을 수 없습니다.');
    }
  } catch (error) {
    throw new Error(error.response?.data?.error_message || error.message);
  }
};

// Face Detail API (user_id 조회)
const getUserIdForFaceToken = async (faceToken) => {
  try {
    const formData = new FormData();
    formData.append('api_key', FACEPP_API_KEY);
    formData.append('api_secret', FACEPP_API_SECRET);
    formData.append('face_token', faceToken);

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/face/getdetail',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    console.log('딜레이 시작');
    setTimeout(() => {
      console.log('3초 후 실행됨');
    }, 3000);

    return response.data.user_id || '없음';
  } catch (error) {
    console.error(`❌ user_id 조회 실패 (face_token: ${faceToken}):`, error.message);
    return '조회 실패';
  }
};
app.get('/', (req, res) => {
  res.send('🚀 서버가 정상적으로 실행 중입니다!');
});
// 얼굴 추가 API (FaceSet에 등록)
app.post('/add-face', async (req, res) => {
  try {
    const { base64Image, name } = req.body;
    if (!base64Image || !name) {
      return res.status(400).json({ message: '이름과 이미지를 입력하세요.' });
    }

    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // 1️⃣ 얼굴 감지 (face_token 얻기)
    const faceToken = await detectFace(imageData);
    console.log('✅ 감지된 face_token:', faceToken);

    // 2️⃣ face_token을 FaceSet에 추가
    const formData = new FormData();
    formData.append('api_key', FACEPP_API_KEY);
    formData.append('api_secret', FACEPP_API_SECRET);
    formData.append('outer_id', FACESET_OUTER_ID);
    formData.append('face_tokens', faceToken);
    formData.append('user_data', name);

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/faceset/addface',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );

    if (response.data.error_message) {
      console.log('❌ API 응답 오류:', response.data.error_message);
      throw new Error(response.data.error_message);
    }

    console.log('✅ 얼굴 추가 성공:', response.data);

    // 3️⃣ user_id 설정 (SetUserID API 호출)
    const setUserIdFormData = new FormData();
    setUserIdFormData.append('api_key', FACEPP_API_KEY);
    setUserIdFormData.append('api_secret', FACEPP_API_SECRET);
    setUserIdFormData.append('face_token', faceToken);
    setUserIdFormData.append('user_id', name);

    // SetUserId 호출 전에 잠시 대기
    await new Promise((resolve) => setTimeout(resolve, 7000));

    try {
      const setUserIdResponse = await axios.post(
        'https://api-us.faceplusplus.com/facepp/v3/face/setuserid',
        setUserIdFormData,
        {
          headers: setUserIdFormData.getHeaders(),
        },
      );
      console.log('✅ user_id 설정 성공:', setUserIdResponse.data);
    } catch (error) {
      console.error('❌ SetUserID API 오류:', error.response ? error.response.data : error.message);
      throw new Error('SetUserID API 호출 실패');
    }

    res.json({ message: '얼굴 등록 및 user_id 설정 성공', data: 'user_id 설정 완료' });
  } catch (error) {
    console.error('❌ 얼굴 및 이름 추가 오류:', error.message);
    res.status(500).json({ message: '얼굴 및 이름 추가 실패', error: error.message });
  }
});

// 얼굴 인식 API
// 얼굴 인식 API 수정
app.post('/face-recognition', async (req, res) => {
  try {
    const { base64Image } = req.body;
    if (!base64Image) {
      return res.status(400).json({ message: '이미지가 없습니다.' });
    }

    const imageData = base64Image.replace(/^data:image\/\w+;base64,/, '');

    // 1️⃣ 먼저, 얼굴을 감지하여 face_token 얻기
    const detectedFaceToken = await detectFace(imageData); // 얼굴 감지 후 face_token 얻기

    // 2️⃣ Face++의 search API를 사용하여 해당 face_token을 찾음
    const searchedFaceToken = await searchFaceInFaceSet(imageData); // 검색된 face_token

    if (!searchedFaceToken) {
      return res.status(400).json({ message: '해당 얼굴을 찾을 수 없습니다.' });
    }

    // 3️⃣ 찾은 face_token을 이용하여 사용자 정보 조회
    //  const userId = await getUserIdForFaceToken(searchedFaceToken); // 얼굴에 해당하는 사용자 정보 조회
    userId = searchedFaceToken;
    if (userId === '없음') {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    res.json({ message: '얼굴 인식 성공', user_id: userId });
  } catch (error) {
    console.error('❌ 얼굴 인식 실패:', error.message);
    res.status(500).json({ message: '얼굴 인식 중 오류 발생', error: error.message });
  }
});
// 등록된 얼굴 목록 조회 API
app.get('/api/faceset/detail', async (req, res) => {
  try {
    const data = qs.stringify({
      api_key: FACEPP_API_KEY,
      api_secret: FACEPP_API_SECRET,
      outer_id: FACESET_OUTER_ID,
    });

    const response = await axios.post(
      'https://api-us.faceplusplus.com/facepp/v3/faceset/getdetail',
      data,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    if (response.data.error_message) {
      console.error('❌ API 응답 오류:', response.data.error_message);
      throw new Error(response.data.error_message);
    }

    const faces = await Promise.all(
      response.data.face_tokens.map(async (face_token) => {
        const user_id = await getUserIdForFaceToken(face_token);
        return { face_token, user_id };
      }),
    );

    console.log('✅ 등록된 얼굴 목록:', faces);
    res.json(faces);
  } catch (error) {
    console.error('❌ 얼굴 목록 조회 오류:', error.message);
    res.status(500).json({ message: '얼굴 목록 조회 실패', error: error.message });
  }
});

// 네이버 로그인 리디렉션
app.get('/naver', (req, res) => {
  req.session.returnTo = req.get('Referer') || '/';
  const state = Math.random().toString(36).substring(2, 15);
  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${NAVER_REDIRECT_URI}&state=${state}`;
  res.redirect(naverAuthUrl);
});

// 네이버 로그인 콜백 처리
app.get('/naver/callback', async (req, res) => {
  const { code, state } = req.query;
  if (!code) return res.status(400).send('네이버 인증 코드가 없습니다.');

  try {
    const tokenResponse = await axios.post('https://nid.naver.com/oauth2.0/token', null, {
      params: {
        grant_type: 'authorization_code',
        client_id: NAVER_CLIENT_ID,
        client_secret: NAVER_CLIENT_SECRET,
        redirect_uri: NAVER_REDIRECT_URI,
        code,
        state,
      },
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const accessToken = tokenResponse.data.access_token;

    const userInfoResponse = await axios.get('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userInfoResponse.data.response;
    req.session.userId = user.id;
    req.session.userName = user.name;

    // redirectUrl이 세션에 존재하는 경우, 없으면 기본값으로 설정
    let redirectUrl = req.session.redirectUrl || '/'; // 기본값을 '/'로 설정
    console.log('네이버 갈곳은', redirectUrl);

    // 리디렉션 후 세션에서 삭제
    delete req.session.redirectUrl; // 리디렉션 후 세션에서 삭제

    // 만약 상대경로일 경우, 클라이언트 주소로 절대경로를 붙여주기
    if (
      !redirectUrl.startsWith('http://localhost:5173') &&
      !redirectUrl.startsWith('https://localhost:5173')
    ) {
      // 상대 경로라면 'http://localhost:5173'을 앞에 붙여 절대 경로로 만듬
      redirectUrl = 'http://localhost:5173' + redirectUrl;
    }

    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ 네이버 로그인 처리 중 오류 발생:', error.message);
    res.status(500).send('네이버 로그인 처리 오류');
  }
});

// 카카오 로그인 리디렉션
app.get('/kakao', (req, res) => {
  const redirectUrl = req.query.redirect || 'http://localhost:5173/'; // 기본값 설정
  //req.session.redirectUrl = redirectUrl;
  console.log('카카오로그인');
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}`;
  console.log('카카오로그인2');
  res.redirect(kakaoAuthUrl);
});

// 카카오 로그인 콜백 처리
// 카카오 로그인 콜백 처리
// 카카오 로그인 콜백 처리
// 카카오 로그인 콜백 처리
// 카카오 로그인 콜백 처리
// 카카오 로그인 콜백 처리
app.get('/kakao/callback', async (req, res) => {
  const { code } = req.query;
  console.log('카카오콜백');
  console.log('카카오 로그인 후 세션에 저장된 redirectUrl1 :', req.session.redirectUrl);

  if (!code) return res.status(400).send('카카오 인증 코드가 없습니다.');

  try {
    const tokenResponse = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      qs.stringify({
        grant_type: 'authorization_code',
        client_id: KAKAO_CLIENT_ID,
        redirect_uri: KAKAO_REDIRECT_URI,
        code,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      },
    );

    const { access_token } = tokenResponse.data;
    const userInfoResponse = await axios.get('https://kapi.kakao.com/v2/user/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    req.session.kakaoUser = userInfoResponse.data;
    req.session.accessToken = access_token; // 카카오의 access_token을 세션에 저장
    console.log('세션에 저장된 카카오 사용자 정보:', req.session.kakaoUser);

    // 로그인 후 세션에 저장된 redirectUrl을 확인
    console.log('카카오 로그인 후 세션에 저장된 redirectUrl:', req.session.redirectUrl);

    // redirectUrl이 세션에 존재하는 경우, 없으면 기본값으로 설정
    let redirectUrl = req.session.redirectUrl || '/'; // 기본값을 '/'로 설정
    console.log('갈곳은', redirectUrl);

    // 리디렉션 후 세션에서 삭제
    delete req.session.redirectUrl; // 리디렉션 후 세션에서 삭제

    // 만약 상대경로일 경우, 클라이언트 주소로 절대경로를 붙여주기
    if (
      !redirectUrl.startsWith('http://localhost:5173') &&
      !redirectUrl.startsWith('https://localhost:5173')
    ) {
      // 상대 경로라면 'http://localhost:5173'을 앞에 붙여 절대 경로로 만듬
      redirectUrl = 'http://localhost:5173' + redirectUrl;
    }

    // 세션 덮어쓰지 않도록 하기 위해, 리디렉션 전에 세션 값 유지
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('❌ 카카오 로그인 오류:', error.message);
    res.status(500).send('카카오 로그인 처리 오류');
  }
});

// 로그인된 사용자 정보 반환 API
app.get('/user-info', (req, res) => {
  // 먼저 카카오 로그인 정보가 있는지 확인
  if (req.session.kakaoUser) {
    res.json({
      userId: req.session.kakaoUser.id,
      userName: req.session.kakaoUser.properties.nickname,
    });
  }
  // 카카오 정보가 없다면, 일반 userId와 userName을 확인
  else if (req.session.userId) {
    res.json({
      userId: req.session.userId,
      userName: req.session.userName,
    });
  }
  // 로그인 정보가 아예 없으면 401 에러 반환
  else {
    res.status(401).send('로그인 정보 없음');
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('로그아웃 처리 오류');
    }
    res.send('로그아웃 성공');
  });
});
app.post('/save-redirect-url', (req, res) => {
  const { redirectUrl } = req.body;
  if (!redirectUrl) {
    return res.status(400).json({ message: '리디렉션할 URL이 없습니다.' });
  }
  console.log('세션에 저장된 redirectUrl:', redirectUrl); // 디버깅을 위한 로그 추가
  req.session.redirectUrl = redirectUrl;
  res.json({ message: '리디렉션 URL 저장 완료' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});
