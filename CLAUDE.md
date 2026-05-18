# CLAUDE.md — 천마광장 해커톤 개발 가이드

## 역할
당신은 해커톤 풀스택 개발자입니다.
프론트엔드 중심으로 빠르게 동작하는 MVP를 구현합니다.

## 목표
docs/ 폴더의 기획서와 기능명세서를 기준으로,
공개 안건 + 비공개 문의 기능을 구현합니다.

---

## 절대 규칙
- 모든 구현은 docs/ 명세서 기준으로 할 것
- 명세서에 없는 기능은 임의로 추가하지 말 것
- 불명확한 부분은 추측하지 말고 질문 먼저
- 한 번에 한 페이지씩 완성 후 다음으로 넘어갈 것
- UI 텍스트는 반드시 한국어로 작성

---

## 참고 문서
- `docs/planning.md` — 서비스 기획서
- `docs/agenda-spec.md` — 공개 안건 기능명세서 (내 담당)
- `docs/inquiry-spec.md` — 비공개 문의 기능명세서 (내 담당)
- `docs/ui/` — HTML 목업 (디자인 참고용, 있을 경우)

---

## 기술 스택
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- Routing: React Router v6
- Backend: Express.js (최소한의 REST API)
- DB: MariaDB (환경변수 $DB_HOST / $DB_PORT)

---

## 담당 범위

### 공개 안건
1. 안건 목록 페이지 (`/agendas`)
2. 안건 상세 페이지 (`/agendas/:id`)
3. 안건 작성 페이지 (`/agendas/new`)

### 비공개 문의
4. 문의 작성 페이지 (`/inquiries/new`)
5. 내 문의함 페이지 (`/my-inquiries`)

---

## 프로젝트 구조
```
├── CLAUDE.md
├── docs/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── layout/      # GNB, Sidebar
│       │   ├── agenda/      # AgendaCard, VoteButtons, StatusTimeline
│       │   └── common/      # Toast, Modal, Badge, Pagination
│       ├── pages/
│       ├── hooks/
│       ├── types/
│       ├── constants/
│       └── lib/api.ts
├── backend/
│   ├── index.js
│   ├── routes/
│   └── db.js
└── sql/
    └── init.sql
```

---

## 코딩 컨벤션
- 컴포넌트: PascalCase (`AgendaCard.tsx`)
- API 응답: snake_case
- 프론트 상태: camelCase
- 데스크탑 우선 (모바일 후순위)

---

## 해커톤 우선순위
- 핵심 플로우 동작 > 완벽한 에러 처리
- 실제 데이터 연동 > 목업 데이터
- 페이지 완성 > 세부 인터랙션
- 기능 구현 > 코드 품질

---

## 금지사항
- 명세서 무시한 임의 기능 추가
- 과도한 추상화나 패턴 적용
- 미사용 라이브러리 설치
- 완성되지 않은 페이지 방치 후 다음 작업 이동