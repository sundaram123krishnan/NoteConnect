"use client";

import { Button } from "@/once-ui/components/Button";
import { authClient } from "../../../lib/auth-client";
import { redirect, useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return <Button onClick={signOut}>Logout</Button>;
}
