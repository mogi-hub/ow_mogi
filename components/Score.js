"use client";
import { useEffect, useRef, useState } from "react";

function Num({ value }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(value);
  useEffect(() => {
    if (prev.current !== value) { prev.current = value; setBump(true); const t = setTimeout(() => setBump(false), 400); return () => clearTimeout(t); }
  }, [value]);
  return <div className={"num" + (bump ? " bump" : "")}>{value}</div>;
}

export default function Score({ joinCount, outCount }) {
  return (
    <section className="score" aria-live="polite">
      <div className="hud clip sj"><Num value={joinCount} /><div className="lbl">🟢 참여</div></div>
      <div className="hud clip so"><Num value={outCount} /><div className="lbl">🔴 미참여</div></div>
    </section>
  );
}
