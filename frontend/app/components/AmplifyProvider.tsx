"use client";
import React from "react";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       "us-east-1_VsKleKMOt",
      userPoolClientId: "6e9k91krped2j1rbngqcfcg2ai",
      loginWith: {
        oauth: {
          domain:          "project-polly-auth-039612868851.auth.us-east-1.amazoncognito.com",
          scopes:          ["email", "openid", "profile"],
          redirectSignIn:  ["https://project-polly-rho.vercel.app", "http://localhost:3000"],
          redirectSignOut: ["https://project-polly-rho.vercel.app", "http://localhost:3000"],
          responseType:    "code",
        },
      },
    },
  },
});

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
