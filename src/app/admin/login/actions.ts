"use server";

import { redirect } from "next/navigation";
import { credentialsValid, setSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const user = String(formData.get("user") ?? "");
  const pass = String(formData.get("pass") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  if (!credentialsValid(user, pass)) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  await setSessionCookie(user);
  redirect(next.startsWith("/admin") ? next : "/admin");
}
