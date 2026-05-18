# 관리자 대시보드 1차 설계

## 목표

관리자 기능은 한 번에 한 페이지씩 완성한다. 1차 범위는 `/admin` 대시보드이며, 관리자 코드 로그인, 보호 라우트, 실제 DB 기반 대시보드 API, 최소 프론트 화면 연결을 포함한다.

## 확정 사항

- 관리자 로그인 코드는 `admin2026`으로 고정한다.
- 로그인 성공 시 프론트 `localStorage`에 관리자 플래그를 저장한다.
- `/admin` 접근 시 관리자 플래그가 없으면 `/admin/login`으로 이동한다.
- 대시보드 데이터는 실제 DB 데이터만 사용한다.
- 데이터가 없으면 백엔드는 0과 빈 배열을 반환하고, 프론트는 빈 상태 문구를 보여준다.
- 화면은 답변 대기 문의를 가장 크게 보여주는 문의 우선형 레이아웃을 사용한다.

## 백엔드 설계

`backend/routes/admin.js`를 추가하고 `backend/index.js`에서 `/api/admin`으로 연결한다. 1차 API는 `GET /api/admin/dashboard` 하나만 둔다.

응답은 KPI, 답변 대기 문의 목록, 공감도 높은 안건 목록, 통계 바 차트 데이터를 포함한다.

```json
{
  "data": {
    "metrics": {
      "total_agendas": 0,
      "weekly_new_agendas": 0,
      "pending_inquiries": 0,
      "reviewing_agendas": 0,
      "completed_agendas": 0
    },
    "pending_inquiries": [],
    "popular_agendas": [],
    "charts": {
      "agenda_categories": [],
      "agenda_statuses": [],
      "inquiry_categories": []
    }
  }
}
```

집계 기준은 다음과 같다.

- 이번 주 신규 안건은 MariaDB `YEARWEEK(created_at, 1)` 기준으로 계산한다.
- 답변 대기 문의는 `status = '답변 대기'` 기준이다.
- 검토 중 안건은 `status = '검토 중'` 기준이다.
- 반영 완료는 `status = '반영 완료'` 누적 기준이다.
- 공감도 높은 안건은 공감률 내림차순 상위 5개다.
- 투표 수가 0이면 공감률은 0으로 계산한다.
- 답변 대기 문의 목록은 오래된 순 상위 5개다.
- 통계 차트는 명세에 정의된 카테고리와 상태를 0값까지 포함해서 반환한다.

## 프론트 설계

`/admin/login`과 `/admin` 라우트를 추가한다. 기존 학생용 `Layout`은 건드리지 않고 관리자 화면은 별도 페이지로 둔다.

`/admin/login`은 관리자 코드 입력과 오류 메시지만 제공한다. `/admin`은 API를 호출해 관리자 전용 다크 GNB, KPI 카드, 답변 대기 문의, 공감도 높은 안건, 통계 바 차트를 표시한다.

1차에서 `/admin/agendas`, `/admin/inquiries` 화면은 구현하지 않는다. 대시보드의 전체 보기 링크는 다음 단계 진입점으로만 남긴다.

## 검증 기준

- 백엔드 헬퍼 테스트가 통과한다.
- 프론트 빌드가 통과한다.
- 가능하면 로컬 서버에서 `/admin/login`에서 `/admin` 이동을 확인한다.
- DB 연결이 불가능하면 그 사실을 결과에 기록하고, 가능한 정적 검증을 완료한다.
