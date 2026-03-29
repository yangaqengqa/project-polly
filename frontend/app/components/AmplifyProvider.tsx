"use client";
import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";

const APP_URL   = "https://project-polly-rho.vercel.app";
const REDIRECTS = [APP_URL, "http://localhost:3000"];

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       process.env.NEXT_PUBLIC_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain:          process.env.NEXT_PUBLIC_COGNITO_DOMAIN!.replace(/^https?:\/\//, ""),
          scopes:          ["email", "openid", "profile"],
          redirectSignIn:  REDIRECTS,
          redirectSignOut: REDIRECTS,
          responseType:    "code",
        },
      },
    },
  },
});

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId:       process.env.NEXT_PUBLIC_USER_POOL_ID!,
          userPoolClientId: process.env.NEXT_PUBLIC_CLIENT_ID!,
          loginWith: {
            oauth: {
              domain:          process.env.NEXT_PUBLIC_COGNITO_DOMAIN!.replace(/^https?:\/\//, ""),
              scopes:          ["email", "openid", "profile"],
              redirectSignIn:  REDIRECTS,
              redirectSignOut: REDIRECTS,
              responseType:    "code",
            },
          },
        },
      },
    });
  }, []);

  return <>{children}</>;
}
