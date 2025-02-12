"use client";

import { useEffect, useRef } from "react";
import { init, backButton, useSignal } from "@telegram-apps/sdk-react";

export function MiniApp() {
  const initRef = useRef(false);

  useEffect(() => {
    if (!initRef.current) {
      console.count("calling init");
      init();
      console.count("init done");
      initRef.current = true;
    }
    if (!backButton.isMounted()) backButton.mount();
  }, []);

  const isMounted = useSignal(backButton.isMounted);
  const isVisible = useSignal(backButton.isVisible);

  useEffect(() => {
    console.log(
      "The button is",
      isVisible ? "visible" : "invisible",
      isMounted ? "mounted" : "not mounted"
    );
  }, [isVisible, isMounted]);

  return (
    <div>
      <span>thats a mini app</span>
      <span>visibility {isVisible}</span>
      <span>mounted {isMounted}</span>
      <span>type1 {typeof isVisible}</span>
      <span>type2 {typeof isMounted}</span>
    </div>
  );
}
