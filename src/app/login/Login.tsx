"use client";
import {
  Background,
  Button,
  Card,
  Column,
  DateRange,
  Flex,
  Heading,
  Input,
  Line,
  Logo,
  PasswordInput,
  Row,
  SmartLink,
  useToast,
} from "@/once-ui/components";
import { ReactNode, useState } from "react";
import { z } from "zod";
import { authClient } from "../../../lib/auth-client";
import { ErrorContext } from "better-auth/react";
import { useRouter } from "next/navigation";

const User = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at most 8 characters" }),
});

export default function Login() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    const result = User.safeParse({ email, password });
    if (!result.success) {
      result.error.errors.forEach((err) => {
        addToast({
          variant: "danger",
          message: err.message,
        });
      });
      return;
    }
    await authClient.signIn.email(
      {
        email: email,
        password: password,
      },
      {
        onSuccess: async () => {
          addToast({
            variant: "success",
            message: "Successfully logged in",
          });
          router.push("/");
          router.refresh();
        },
        onError: (ctx: ErrorContext) => {
          addToast({
            variant: "danger",
            message: ctx.error.message ?? "Something went wrong",
          });
        },
      }
    );
  }

  return (
    <Column vertical="center">
      <Column
        fillWidth
        horizontal="center"
        gap="20"
        padding="32"
        position="relative"
      >
        <Background
          mask={{
            x: 100,
            y: 0,
            radius: 75,
          }}
          position="absolute"
          grid={{
            display: true,
            opacity: 50,
            width: "0.5rem",
            color: "neutral-background-alpha",
            height: "1rem",
          }}
        />
        {/*TODO: Add logo here */}
        {/* <Logo wordmark={false} size="l" /> */}
        <Heading as="h3" variant="display-default-s" align="center">
          Welcome to NoteConnect
        </Heading>
        <p className="mb-24">
          Log in or
          <SmartLink href="/">sign up</SmartLink>
        </p>
        <Column fillWidth gap="8">
          <Button
            label="Continue with Google"
            fillWidth
            variant="secondary"
            weight="default"
            prefixIcon="google"
            size="l"
            disabled={loading}
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",

                callbackURL: "/",
              });
            }}
          />
        </Column>
        <Row fillWidth paddingY="24">
          <Row onBackground="neutral-weak" fillWidth gap="24" vertical="center">
            <Line />/<Line />
          </Row>
        </Row>
        <Column gap="-1" fillWidth>
          <Input
            id="email"
            label="Email"
            labelAsPlaceholder
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            errorMessage={false}
            radius="top"
          />
          <PasswordInput
            autoComplete="new-password"
            id="password"
            label="Password"
            labelAsPlaceholder
            radius="bottom"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </Column>
        <Button
          id="login"
          label="Log in"
          arrowIcon
          fillWidth
          onClick={handleSubmit}
        />
      </Column>
    </Column>
  );
}
