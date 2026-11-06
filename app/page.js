"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { config } from "@/lib/config";
import Header from "@/components/Header";
import Score from "@/components/Score";
import RsvpForm from "@/components/RsvpForm";
import Progress from "@/components/Progress";
import PlayerList from "@/components/PlayerList";
import AdminPanel from "@/components/AdminPanel";

export default function Page() {
  const [rows, setRows] = useState([]);
  const [settings, setSettings] = useState({
    siteTitle: config.siteTitle, headline: config.headline,
    eventTitle: config.eventTitle, eventTime: config.eventTime,
    expectedPlayers: config.expectedPlayers, ...config.theme,
  });
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [r, s] = await Promise.all([
      supabase.from("responses").select("name,status,updated_at").order("updated_at"),
      supabase.from("settings").select("k,v"),
    ]);
    if (r.error) { setError("데이터를 불러오지 못했어요. 새로고침해 주세요."); return; }
    setError("");
    setRows(r.data);
    const map = Object.fromEntries((s.data || []).map(x => [x.k, x.v]));
    setSettings(prev => ({
      ...prev, ...map,
      expectedPlayers: parseInt(map.expectedPlayers, 10) || config.expectedPlayers,
    }));
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("ow-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "responses" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "settings" }, load)
      .subscribe();
    const poll = setInterval(load, 15000); // 실시간이 끊겨도 15초마다 보정
    return () => { supabase.removeChannel(ch); clearInterval(poll); };
  }, [load]);

  useEffect(() => {
    const root = document.documentElement.style;
    for (const k of ["join", "out", "accent", "warn"]) root.setProperty("--" + k, settings[k]);
    document.title = settings.siteTitle;
  }, [settings]);

  const join = rows.filter(r => r.status === "join");
  const out = rows.filter(r => r.status === "out");
  const updatedAt = rows.reduce((m, r) => Math.max(m, new Date(r.updated_at).getTime()), 0);

  return (
    <main>
      <Header settings={settings} />
      <Score joinCount={join.length} outCount={out.length} />
      <RsvpForm join={join} out={out} />
      {error && <div className="msg" style={{ color: "var(--out)" }}>{error}</div>}
      <Progress join={join} out={out} updatedAt={updatedAt} expectedPlayers={settings.expectedPlayers} />
      <PlayerList join={join} out={out} />
      <AdminPanel settings={settings} />
    </main>
  );
}
