import { ReactNode } from "react";

type Props = { children: ReactNode };

/**
 * Page transition is intentionally a no-op now.
 * Previous fade + AnimatePresence(mode="wait") added ~360ms of perceived
 * delay between routes. We rely on prefetched chunks (Header.tsx) and
 * cached queries (lib/queries.ts) for instant navigation instead.
 */
export const PageTransition = ({ children }: Props) => <>{children}</>;