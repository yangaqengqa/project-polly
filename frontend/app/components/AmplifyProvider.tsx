"use client";
import React from "react";
import { Amplify } from "aws-amplify";

const cognitoDomain = (process.env.NEXT_PUBLIC_COGNITO_DOMAIN ?? "").replace("https://", "");
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       process.env.NEXT_PUBLIC_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_CLIENT_ID ?? "",
      loginWith: {
        oauth: {
          domain:          cognitoDomain,
          scopes:          ["email", "openid", "profile"],
          redirectSignIn:  [appUrl, "http://localhost:3000"],
          redirectSignOut: [appUrl, "http://localhost:3000"],
          responseType:    "code",
        },
      },
    },
  },
});

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
