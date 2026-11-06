import crypto from "node:crypto";
import { admin } from "./supabaseServer";

// 비밀번호 확인: 웹에서 바꾼 비밀번호(해시)가 있으면 그것, 없으면 환경변수 ADMIN_PASSWORD
export async function verify(pw) {
  if (!pw) return false;
  const { data } = await admin.from("secrets").select("v").eq("k", "adminHash").maybeSingle();
  if (data?.v) {
    const [salt, hash] = data.v.split(":");
    const h = crypto.scryptSync(String(pw), salt, 32).toString("hex");
    return h.length === hash.length && crypto.timingSafeEqual(Buffer.from(h), Buffer.from(hash));
  }
  return !!process.env.ADMIN_PASSWORD && pw === process.env.ADMIN_PASSWORD;
}

export async function setPassword(pw) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(String(pw), salt, 32).toString("hex");
  return admin.from("secrets").upsert({ k: "adminHash", v: `${salt}:${hash}` }, { onConflict: "k" });
}
