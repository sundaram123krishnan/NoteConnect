import { UserMenu, Flex } from "@/once-ui/components";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import LogoutButton from "./Logout";

export default async function UserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const image = session?.user.image;
  return (
    <UserMenu
      avatarProps={{
        src: image as string,
        empty: image !== undefined ? false : true,
      }}
      dropdown={
        <>
          <Flex padding="2" fillWidth>
            <LogoutButton />
          </Flex>
        </>
      }
    />
  );
}
