## 📁폴더 구조 설명
```
/my-react-app
├── /public
│   └── index.html                  # HTML 템플릿 파일
├── /src
│   ├── /assets                     # 이미지, 폰트, 스타일 등 정적 파일
│   ├── /components                 # 재사용 가능한 UI 컴포넌트
│   ├── /pages                      # 페이지 컴포넌트 (라우팅되는 컴포넌트)
│   ├── /hooks                      # 커스텀 훅
│   ├── /services                   # API 호출 및 비즈니스 로직 처리
│   ├── /context                    # Context API 관련 파일
│   ├── /utils                      # 유틸리티 함수들
│   ├── /styles                     # 공통 스타일 파일 (CSS, SCSS 등)
│   ├── /store                      # 상태 관리 관련 (Redux, Zustand 등)
│   ├── /tests                      # 테스트 관련 파일 (Jest, React Testing Library 등)
│   ├── App.js                      # 루트 컴포넌트
│   ├── index.js                    # 엔트리 포인트
│   ├── /types                      # 타입스크립트를 사용할 경우 타입 정의
└── .gitignore                       # Git에서 무시할 파일들
```

## ⚙ VITE 환경에서 환경변수를 사용하는 방법
### .env.local
```.env
VITE_API_KEY=fsdfs63456534 # 와 같은 환경변수가 있다고 가정
```


### App.jsx
```javascript
import Form from 'react-bootstrap/Form';

function App() {

    const apiKey = import.meta.env.VITE_API_KEY; // 와 같이 해야 함
  return (
    <>
      <Form>
      </Form>
    </>
  );
}

export default App;


```