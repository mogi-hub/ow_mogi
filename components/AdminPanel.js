"use client";
import { useState } from "react";

const TEXTS = [["siteTitle", "사이트 제목"], ["headline", "메인 문구"], ["eventTitle", "모임 제목"], ["eventTime", "모임 날짜/시간"]];
const COLORS = [["join", "참여 색"], ["out", "미참여 색"], ["accent", "포인트 색"], ["warn", "모임 정보 색"]];

export default function AdminPanel({ settings }) {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [form, setForm] = useState(settings);
  const [newPw, setNewPw] = useState("");
  const [msg, setMsg] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function call(action, extra = {}) {
    const r = await fetch("/api/admin/" + action, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw, ...extra }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "실패");
    return j;
  }
  const act = (fn, ok) => async () => { try { await fn(); setMsg(ok); } catch (e) { setMsg(e.message); } };

  const login = act(async () => { await call("verify"); setForm(settings); setAuthed(true); }, "관리자 모드");
  const save = act(() => call("settings", { settings: form }), "✅ 저장했어요. 모두의 화면에 바로 반영됩니다.");
  const reset = () => confirm("모든 응답을 초기화할까요?") && act(() => call("reset"), "✅ 초기화했어요.")();
  const changePw = act(async () => { await call("password", { newPassword: newPw }); setPw(newPw); setNewPw(""); }, "✅ 비밀번호를 바꿨어요.");

  return (
    <footer>
      <button onClick={() => setOpen(!open)}>관리자</button>
      {open && (
        <div className="hud clip admin">
          {!authed ? (
            <>
              <input type="password" placeholder="관리자 비밀번호" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === "Enter" && login()} />
              <div className="row"><button onClick={login}>로그인</button></div>
            </>
          ) : (
            <>
              {TEXTS.map(([k, label]) => (
                <label key={k} className="fld">{label}<input value={form[k] || ""} onChange={e => set(k, e.target.value)} /></label>
              ))}
              <label className="fld">전체 인원 수 (응답률 계산용)
                <input type="number" min="1" max="200" value={form.expectedPlayers} onChange={e => set("expectedPlayers", e.target.value)} />
              </label>
              <div className="colors">
                {COLORS.map(([k, label]) => (
                  <label key={k} className="fld">{label}<input type="color" value={form[k]} onChange={e => set(k, e.target.value)} /></label>
                ))}
              </div>
              <div className="row"><button onClick={save}>설정 저장</button><button className="danger" onClick={reset}>RESET ALL RESPONSES</button></div>
              <label className="fld" style={{ marginTop: 14 }}>비밀번호 변경 (6자 이상)
                <input type="password" placeholder="새 비밀번호" value={newPw} onChange={e => setNewPw(e.target.value)} />
              </label>
              <div className="row"><button onClick={changePw}>비밀번호 변경</button></div>
            </>
          )}
          <div className="msg">{msg}</div>
        </div>
      )}
    </footer>
  );
}
