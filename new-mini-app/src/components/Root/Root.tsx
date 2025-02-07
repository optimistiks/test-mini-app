"use client";

import { type PropsWithChildren, useEffect } from "react";
import {
  initData,
  miniApp,
  retrieveLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import { TonConnectUIProvider } from "tonconnect-ui-react19";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ErrorPage } from "@/components/ErrorPage";
import { useTelegramMock } from "@/hooks/useTelegramMock";
import { useDidMount } from "@/hooks/useDidMount";
import { useClientOnce } from "@/hooks/useClientOnce";
import { setLocale } from "@/core/i18n/locale";
import { useInit } from "@/core/init";

import "./styles.css";

const isDev = process.env.NODE_ENV === "development";

function RootInner({ children }: PropsWithChildren) {
  console.log("ISDEV", isDev);

  // Mock Telegram environment in development mode if needed.
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useTelegramMock();
  }

  const lp = retrieveLaunchParams();
  const debug = isDev || lp.tgWebAppStartParam === "debug";

  // Initialize the library.
  useInit(debug);

  const isDark = useSignal(miniApp.isDark);
  const initDataUser = useSignal(initData.user);

  // Set the user locale.
  useEffect(() => {
    if (initDataUser) {
      setLocale(initDataUser.language_code);
    }
  }, [initDataUser]);

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <AppRoot
        appearance={isDark ? "dark" : "light"}
        platform={
          ["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"
        }
      >
        {children}
      </AppRoot>
    </TonConnectUIProvider>
  );
}

export function Root(props: PropsWithChildren) {
  return (
    <ErrorBoundary fallback={ErrorPage}>
      <RootInner {...props} />
    </ErrorBoundary>
  );
  // Unfortunately, Telegram Mini Apps does not allow us to use all features of
  // the Server Side Rendering. That's why we are showing loader on the server
  // side.
  // const didMount = useDidMount();

  // return didMount ? (
  //   <ErrorBoundary fallback={ErrorPage}>
  //     <RootInner {...props} />
  //   </ErrorBoundary>
  // ) : (
  //   <div className="root__loading">Loading</div>
  // );
}
