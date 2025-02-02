"use client";

import { useRouter } from "next/navigation";
import { authClient } from "../../../lib/auth-client";
import { Button } from "@/once-ui/components/Button";

export default function LogoutButton() {
  const router = useRouter();
  async function signOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <Button
      id="logout"
      label="Log out"
      arrowIcon
      fillWidth
      onClick={signOut}
      variant="secondary"
    />
  );
}
