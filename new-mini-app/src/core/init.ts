import { useClientOnce } from "@/hooks/useClientOnce";
import {
  backButton,
  viewport,
  themeParams,
  miniApp,
  initData,
  setDebug,
  init as initSDK,
  useSignal,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";

/**
 * Initializes the application and configures its dependencies.
 */
export function useInit(debug: boolean): void {
  const isBackButtonMounted = useSignal(backButton.isMounted);
  const isMiniAppMounted = useSignal(miniApp.isMounted);
  const areThemeParamsMounted = useSignal(themeParams.isMounted);
  const isViewportMounted = useSignal(viewport.isMounted);

  const viewportData = useSignal(viewport.contentSafeAreaInsetTop);
  const themeData = useSignal(themeParams.backgroundColor);
  const miniAppData = useSignal(miniApp.bottomBarColorRGB);

  useEffect(() => {
    console.log("datas", { viewportData, themeData, miniAppData });
  }, [viewportData, themeData, miniAppData]);

  useEffect(() => {
    console.log({
      isMiniAppMounted,
      areThemeParamsMounted,
      isViewportMounted,
      isBackButtonMounted,
    });
  }, [
    isMiniAppMounted,
    areThemeParamsMounted,
    isViewportMounted,
    isBackButtonMounted,
  ]);

  useClientOnce(() => {
    // Set @telegram-apps/sdk-react debug mode.
    setDebug(debug);

    // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
    // Also, configure the package.
    initSDK();

    initData.restore();

    // Mount all components used in the project.
    if (!backButton.isMounted()) backButton.mount();

    if (!miniApp.isMounted() && !miniApp.isMounting()) miniApp.mount();

    if (!themeParams.isMounted() && !themeParams.isMounting())
      themeParams.mount();

    if (!viewport.isMounted() && !viewport.isMounting()) viewport.mount();

    // Add Eruda if needed.
    if (debug) {
      import("eruda").then((lib) => lib.default.init()).catch(console.error);
    }
  });
}
