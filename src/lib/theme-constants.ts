/** Theme constants and the pre-paint script. Safe to import on the server. */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "dn-theme";
export const THEME_COLORS: Record<Theme, string> = { light: "#f4f5f7", dark: "#0e0f11" };

/**
 * Runs before first paint (inlined in <head>) so the page never flashes the
 * wrong theme. Kept as a string because it executes before React loads.
 */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}var d=document.documentElement;d.classList.add("js");d.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content",t==="dark"?"${THEME_COLORS.dark}":"${THEME_COLORS.light}")}catch(e){}})();`;
