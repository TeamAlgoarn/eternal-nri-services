import type { ReactNode } from "react";

type IconName = "graduation" | "package" | "home" | "bank" | "receipt" | "globe" | "document" | "arrow" | "check" | "menu" | "close";
export function Icon({ name, size = 24 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    graduation: <><path d="m2 10 10-5 10 5-10 5-10-5Z"/><path d="M6 12v5c3.5 3 8.5 3 12 0v-5M22 10v7"/></>,
    package: <><path d="m12 2 9 5-9 5-9-5 9-5ZM3 7v10l9 5 9-5V7M12 12v10M7.5 4.5l9 5"/></>,
    home: <><path d="m3 11 9-8 9 8v10H3V11ZM9 21v-7h6v7"/></>,
    bank: <><path d="m2 9 10-6 10 6M3 9h18M5 9v10m5-10v10m4-10v10m5-10v10M2 21h20M2 19h20"/></>,
    receipt: <><path d="M5 2h14v20l-3-2-4 2-4-2-3 2V2ZM9 8h6M9 12h6M9 16h4"/></>,
    globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-5 5-5 13 0 18M12 3c5 5 5 13 0 18"/></>,
    document: <><path d="M5 2h10l4 4v16H5V2ZM15 2v5h4M8 11h8M8 15h8M8 19h5"/></>,
    arrow: <><path d="M4 12h16M14 6l6 6-6 6"/></>,
    check: <><path d="m4 12 5 5L20 6"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="M5 5l14 14M19 5 5 19"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
