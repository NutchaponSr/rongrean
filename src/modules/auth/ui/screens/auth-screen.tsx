"use client";

import { useMutation } from "@tanstack/react-query";

import { useSignInSocialMutationOptions } from "@/lib/convex/auth-client";

import { Button } from "@/components/ui/button";

export const AuthScreen = () => {
  const signInSocial = useMutation(useSignInSocialMutationOptions());

  const onProvider = (provider: "github" | "google") => {
    signInSocial.mutate({ provider, callbackURL: window.location.origin });
  }

  return (
    <>
      <Button onClick={() => onProvider("github")}>Sign in with GitHub</Button>
      <Button onClick={() => onProvider("google")}>Sign in with Google</Button>
    </>
  )
}