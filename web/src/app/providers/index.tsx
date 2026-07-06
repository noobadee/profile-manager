import { AppQueryProvider } from "./query-client";
import type { PropsWithChildren } from "react";

export function AppProviders({ children }: PropsWithChildren) {
  return <AppQueryProvider>{children}</AppQueryProvider>;
}
