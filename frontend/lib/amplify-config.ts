import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId:       "us-east-1_vcC1h21YG",
      userPoolClientId: "64i757bkb86fto0sccja1cjrrd",
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
