# 🇯🇵 일본 여행 가계부 (Japan Ledger)

**일본 여행 가계부**는 일본 여행 중 겪는 복잡한 결제 수단(트래블로그, 트랩앤J, 지폐, 동전) 관리를 하나의 앱에서 완벽하게 해결하기 위해 만들어진 **오프라인 우선(Offline-first) PWA 모바일 어플리케이션**입니다.

최고급 핀테크 앱(Toss, SOCAR)의 UI/UX 디자인 가이드를 참고하여, 거대한 타이포그래피와 직관적인 인터랙션, 그리고 세련된 글래스모피즘(Glassmorphism) 효과를 적용했습니다.

---

## ✨ 핵심 기능 (Key Features)

### 1. 4가지 지갑 분리 관리
일본 여행의 필수품인 **트래블로그, 트랩앤J(트래블페이), 지폐, 동전** 네 가지 지갑을 완벽하게 분리하여 관리합니다. 카드 잔액과 현금 잔액을 따로 계산하느라 머리 아플 일이 없습니다.

### 2. 🪙 실물 동전 인벤토리 (Interactive Coin Wallet)
진짜 일본 동전(500엔, 100엔, 50엔, 10엔, 5엔, 1엔) 사진을 터치하여 동전 개수를 늘리고 줄일 수 있습니다. 화면 상단의 **내 동전 지갑**과 즉시 연동되며 직관적인 애니메이션을 제공합니다.

### 3. 💸 스마트 지출 내역 (Ledger)
- **날짜별 자동 그룹핑:** 지출 내역이 시간순으로 보기 좋게 정리됩니다.
- **Glassmorphism 필터 칩:** 화면에 은은하게 녹아드는 필터를 이용해 원하는 결제 수단의 내역만 쏙쏙 뽑아볼 수 있습니다.
- **BottomSheet 간편 수정:** 내역을 꾹 누르거나 클릭해 언제든 금액, 카테고리(식비/쇼핑/교통/관광/숙박/기타) 및 메모를 수정할 수 있습니다.

### 4. 🚀 PWA 기반 네이티브 경험
웹사이트지만 스마트폰의 **'홈 화면에 추가'**를 통해 설치하면 브라우저 주소창이 사라지고 **완벽한 네이티브 앱(Native App) 형태**로 구동됩니다. 오프라인 상황(비행기 모드 등)에서도 문제없이 사용할 수 있도록 수동 환율 계산 방식을 채택했습니다.

### 5. 📊 데이터 내보내기 (CSV Export)
여행이 끝난 후 정산을 위해 지금까지 기록한 모든 지출 데이터를 엑셀(CSV) 파일로 깔끔하게 추출할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Framework:** React 18
- **Language:** TypeScript
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Custom Color System & Typography)
- **State Management:** Zustand (w/ LocalStorage Persistence)
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa

---

## 🚀 시작하기 (Getting Started)

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:5173` 으로 접속하세요. 모바일 화면 비율(Chrome DevTools 장치 툴바)로 보시는 것을 권장합니다.

### 3. PWA 빌드 테스트
```bash
npm run build
npm run preview
```
빌드 후 생성된 프리뷰 서버에 접속하면 실제 PWA 설치 버튼이 활성화되는 것을 확인할 수 있습니다.

---

## 📁 프로젝트 구조 (Project Structure)
```text
src/
├── components/   # 공통 재사용 UI 컴포넌트 (Card, Button, Chip, BottomSheet 등)
├── pages/        # 메인 라우트 페이지 (Home, Coin, Ledger, Settings)
├── store/        # Zustand 전역 상태 및 로컬 스토리지 데이터 관리
├── App.tsx       # 앱 라우팅 및 하단 탭바 뼈대
└── index.css     # Tailwind 지시어 및 글로벌 스타일 제어
```
