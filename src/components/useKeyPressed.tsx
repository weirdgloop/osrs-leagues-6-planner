import { useState } from "react";
import { type Keys, useHotkeys } from "react-hotkeys-hook";

export const useKeyPressed = (targetKey: Keys) => {
  const [isPressed, setIsPressed] = useState(false);

  useHotkeys(targetKey, () => setIsPressed(true), { keydown: true });

  useHotkeys(targetKey, () => setIsPressed(false), { keyup: true });

  return isPressed;
};
