export default function PlayerList({ join, out }) {
  const list = (items, cls) => items.length
    ? items.map(r => <div key={r.name} className={`card clip ${cls}`}><span className="dot" />{r.name}</div>)
    : <span className="empty">아직 없음</span>;
  return (
    <>
      <h2 style={{ color: "var(--join)" }}>🟢 참여 예정</h2>
      <div className="list">{list(join, "j")}</div>
      <h2 style={{ color: "var(--out)" }}>🔴 미참여</h2>
      <div className="list">{list(out, "o")}</div>
    </>
  );
}
