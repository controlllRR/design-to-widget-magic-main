import { createContext, useContext } from "react";

/** DOM-узел для портала sheet/modal — вне `overflow-hidden` экрана. */
export const WidgetOverlayContext = createContext<HTMLElement | null>(null);

export function useWidgetOverlayRoot(): HTMLElement | null {
  return useContext(WidgetOverlayContext);
}
