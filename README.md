# Overwatch Party (Next.js + Supabase + Vercel)

친구들은 URL만 클릭 → 닉네임 입력 → 참여/미참여. 설치·가입·로그인 없음.
(아래 설정은 만드는 사람 1명만 한 번 하면 됩니다. 전부 웹 브라우저에서 가능)

## 구조
```
app/page.js              화면 조립 + Supabase 실시간 구독
app/api/respond          응답 저장 (이름 중복 방지 upsert)
app/api/admin/[action]   초기화/모임정보 변경 (비밀번호 필요)
components/              Header, Score, RsvpForm, Progress, PlayerList, AdminPanel
lib/config.js            설정 기본값 (평소엔 관리자 화면에서 변경)
lib/auth.js              관리자 비밀번호 확인/변경
supabase.sql             DB 테이블 생성
```

## 1. Supabase (DB)
1. supabase.com 가입 → New project 생성
2. SQL Editor → `supabase.sql` 내용 붙여넣고 Run
3. Settings → API 에서 Project URL, anon public key, service_role key 복사

## 2. 환경변수 (`.env.example` 참고)
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`
※ service_role 키는 서버 전용입니다. 절대 공유하지 마세요.

## 3. 로컬 실행 (선택)
```
npm install
cp .env.example .env.local   # 값 채우기
npm run dev                  # http://localhost:3000
```

## 4. Vercel 배포
1. 이 폴더를 GitHub 저장소로 업로드
2. vercel.com → Add New → Project → 저장소 Import (Next.js 자동 인식)
3. Environment Variables 에 위 4개 입력 → Deploy
4. 완료되면 `https://프로젝트이름.vercel.app` 이 최종 URL
   (Settings → Domains 에서 `overwatch-party-xxxxx` 같은 이름으로 변경 가능)

## 5. 공유
🎮 오늘 오버워치 ㄱ?
👉 https://프로젝트이름.vercel.app
들어가서 닉네임 입력하고 참여/미참여 눌러줘!

## 관리 (설치 없이 웹에서)
사이트 맨 아래 "관리자" → 비밀번호 로그인 → 아래를 전부 화면에서 변경
- 사이트 제목 / 메인 문구 / 모임 제목 / 모임 날짜·시간
- 전체 인원 수(응답률 계산), 색상 4가지
- 관리자 비밀번호 변경 (처음엔 환경변수 ADMIN_PASSWORD, 바꾸면 DB에 해시로 저장)
- RESET ALL RESPONSES
저장하면 모든 친구 화면에 새로고침 없이 바로 반영됩니다.
※ 기존에 supabase.sql 을 이미 실행했다면 파일 맨 아래 `secrets` 부분만 추가로 실행하세요.
