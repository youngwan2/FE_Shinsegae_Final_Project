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
└── .gitignore                      # Git에서 무시할 파일들
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
      <Form></Form>
    </>
  );
}

export default App;
```

## 커밋 컨벤션

### 전통적인 커밋 컨벤션 형식

```
<타입>(<스코프>): <커밋 메시지>
```

- 타입: 커밋의 목적을 나타내는 키워드
- 스코프 (선택적): 커밋이 영향을 미친 범위나 모듈
- 커밋 메시지: 변경 사항에 대한 간단하고 명확한 설명

### 커밋 타입 예시

- feat: 새로운 기능을 추가할 때 사용
- fix: 버그 수정 시 사용
- docs: 문서 수정 시 사용
- style: 코드 스타일 수정 (주로 들여쓰기, 세미콜론 등과 관련된 수정)
- refactor: 코드 리팩토링 (기능 변경 없이 코드 구조를 개선)
- perf: 성능 최적화
- test: 테스트 코드 추가나 수정
- chore: 빌드 과정 또는 도구 수정 등 잡다한 작업

```
feat(user-auth): add login functionality
fix(button): resolve alignment issue on mobile
docs(readme): update installation instructions
refactor(api): simplify user data processing logic
perf(search): improve search query performance
test(user-auth): add unit tests for login module
```

### 상세한 커밋 내용이 있는 경우

#### 상세 커밋 형식

```
<타입>(<스코프>): <커밋 메시지 제목>

<커밋 메시지 본문>

<이슈 번호와 관련된 내용(선택)>

```

- 타입: 변경의 종류 (예: feat, fix, chore 등)
- 스코프 (선택적): 변경 사항이 적용된 모듈이나 부분
- 커밋 메시지 제목: 간결하고 핵심적인 변경 내용
- 커밋 메시지 본문: 변경 사항에 대한 상세한 설명
- 이슈 번호 (선택적): 관련된 이슈 번호나 참조

#### 커밋 메시지 본문 작성 방식

본문에서는 변경 사항에 대해 더 자세히 설명한다. 보통 본문은 다음과 같은 내용을 포함할 수 있다.

- 문제를 해결한 이유: 왜 이 변경이 필요한지
- 어떻게 해결했는지: 변경을 통해 문제를 어떻게 해결했는지
- 기타 중요한 정보: 예를 들어, 테스트가 추가되었거나, 특정 라이브러리나 버전이 필요하다는 정보

#### 예시

##### 1) 기능 추가

```
feat(user-auth): add JWT authentication

- 사용자가 로그인 후 JWT를 발급받을 수 있도록 기능 추가
- JWT는 로컬 스토리지에 저장되며, 이후 요청 시 Authorization 헤더에 포함됨
- 이를 통해 서버는 유효한 토큰을 확인하고 사용자 인증을 처리
- 추가적으로 로그인 상태를 관리할 수 있는 Redux 액션 및 리듀서 추가

#23
```

- 커밋 메시지 본문에서는 어떤 방식으로 인증을 구현했는지, JWT가 어떻게 사용되는지 등 추가적인 설명을 제공한다. 또한, 관련된 이슈 번호 #23을 추가하여 이 커밋이 어떤 문제를 해결하는지 명시한다.

##### 2) 버그 수정

```
fix(button): resolve alignment issue on mobile

- 모바일 화면에서 버튼이 세로로 잘못 정렬되는 문제 수정
- CSS Flexbox를 사용하여 버튼을 가운데 정렬하도록 변경
- 여러 화면 크기에서 버튼이 일관되게 표시되도록 미디어 쿼리 추가

#42
```

- 커밋 메시지 본문에서는 버그를 수정한 구체적인 방법과 어떤 변경이 이루어졌는지 설명한다. 추가적으로, 해당 버그가 해결된 이슈 번호 #42를 연결한다.

##### 3) 성능 최적화

```
perf(search): optimize query performance for search results

- 검색 쿼리의 성능을 개선하기 위해 인덱스를 추가하고 쿼리 구조 변경
- 데이터베이스에서 불필요한 조인 제거 및 캐싱을 활용한 성능 향상
- 테스트 결과, 검색 시간이 20% 단축됨

#56
```

- 커밋 메시지 본문에서는 성능 최적화가 어떤 방식으로 이루어졌는지, 특히 어떤 쿼리나 기술이 변경되었는지를 구체적으로 설명한다. 성능 향상 효과에 대한 데이터도 제공할 수 있다.

##### 4) 문서 수정

```
docs(readme): update installation instructions for Windows

- Windows 환경에서의 설치 방법에 대한 내용을 추가
- 필요한 소프트웨어 버전 및 설치 순서 명시
- 발생할 수 있는 문제점 및 해결 방법 포함

#60
```

- 커밋 메시지 본문에서는 문서에서 변경된 내용을 상세히 설명하고, 어떤 부분이 업데이트되었는지 명확하게 기재한다.
