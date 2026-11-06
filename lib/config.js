// ★ 자주 바꾸는 설정은 여기 한 곳 (관리자 비밀번호만 환경변수 ADMIN_PASSWORD) ★
export const config = {
  siteTitle: "TODAY'S OVERWATCH",
  headline: "오늘 오버워치 같이 할 사람?",
  eventTitle: "OVERWATCH NIGHT",
  eventTime: "TODAY · 9:00 PM",   // 관리자 화면에서도 변경 가능
  expectedPlayers: 10,            // 응답률 계산용 전체 인원
  theme: { bg: "#070d1a", panel: "#0f1a30", line: "#24385f", text: "#e8f1ff",
           join: "#3dffa0", out: "#ff4d6d", accent: "#35e0ff", warn: "#ffb02e" },
};
