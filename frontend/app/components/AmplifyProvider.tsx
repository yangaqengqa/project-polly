"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Amplify } from "aws-amplify";

const AmplifyReadyContext = createContext(false);
export const useAmplifyReady = () => useContext(AmplifyReadyContext);

export default function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Amplify.configure({
      Auth: {
        Cognito: {
          userPoolId:       "us-east-1_vcC1h21YG",
          userPoolClientId: "64i757bkb86fto0sccja1cjrrd",
          loginWith: {
            oauth: {
              domain:          "project-polly-auth-039612868851.auth.us-east-1.amazoncognito.com",
              scopes:          ["email", "openid", "profile"],
              redirectSignIn:  [window.location.origin],
              redirectSignOut: [window.location.origin],
              responseType:    "code",
            },
          },
        },
      },
    });
    setReady(true);
  }, []);

  return (
    <AmplifyReadyContext.Provider value={ready}>
      {children}
    </AmplifyReadyContext.Provider>
  );
}
