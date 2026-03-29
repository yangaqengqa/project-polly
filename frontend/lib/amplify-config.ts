"use client";
import { Amplify } from "aws-amplify";

const redirectUrl =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://project-polly-rho.vercel.app";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       "us-east-1_vcC1h21YG",
      userPoolClientId: "64i757bkb86fto0sccja1cjrrd",
      loginWith: {
        oauth: {
          domain:          "project-polly-auth-039612868851.auth.us-east-1.amazoncognito.com",
          scopes:          ["email", "openid", "profile"],
          redirectSignIn:  [redirectUrl],
          redirectSignOut: [redirectUrl],
          responseType:    "code",
        },
      },
    },
  },
});
