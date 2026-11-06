-- Supabase > SQL Editor 에 붙여넣고 Run
create table if not exists responses (
  name_key text primary key,                 -- 소문자·공백정리 이름 = 중복 방지
  name text not null,
  status text not null check (status in ('join','out')),
  updated_at timestamptz not null default now()
);
create table if not exists settings (k text primary key, v text not null);

alter table responses enable row level security;
alter table settings  enable row level security;
-- 누구나 읽기만 가능. 쓰기는 서버(API, service_role)만 가능
create policy "read responses" on responses for select using (true);
create policy "read settings"  on settings  for select using (true);

-- 실시간 활성화
alter publication supabase_realtime add table responses, settings;

-- [관리자 비밀번호를 웹에서 바꾸기 위한 테이블] 정책을 만들지 않아 서버(service_role)만 접근 가능
create table if not exists secrets (k text primary key, v text not null);
alter table secrets enable row level security;
