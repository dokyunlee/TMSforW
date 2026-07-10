# Worker Test Studio - HTML Applied UX Version

worker 테스트 세션 구성과 화면 검증을 목적으로 정리한 HTML 프로토타입입니다.

## 적용 내용
- 기존 프로젝트의 `index.html`, `js/app.js`, `js/generator.js` 기능 유지
- 테스트 설정 화면: 흰색 배경, 로열블루 상단 라인, 폼형 카드 UI 적용
- worker 화면: 테스트 진행 화면을 더 분리된 작업 패널 형태로 정리
- 기존 ID/class 구조 유지: 기존 JS 연결이 끊기지 않도록 처리
- 작업자 탭 진입 시 `body.worker-mode` 자동 적용
- 화면 문구에서 운영/배포 목적의 표현을 줄이고 worker 테스트용 문구로 정리

## 실행 방법
1. 압축 해제
2. `index.html`을 브라우저로 열기
3. 테스트 설정 화면에서 입력 후 `안내 메시지 만들기` 클릭
4. `작업자 미리보기` 탭에서 worker 테스트 흐름 확인

## 배포 후 결과 수집
- 배포된 링크에서 여러 작업자의 결과를 모으려면 Supabase 설정이 필요합니다.
- `DEPLOYMENT_CHECKLIST.md`를 따라 환경변수와 테이블을 준비합니다.
- 테이블 생성 SQL은 `docs/supabase_schema.sql`에 있습니다.

## 참고
원본 업로드 HTML은 `docs/task_message_studio_uploaded_reference.html`에 보관했습니다.
