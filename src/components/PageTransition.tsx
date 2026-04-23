import { ReactNode } from "react";

type Props = { children: ReactNode };

/**
 * Minimal page transition: CSS-only, fast, and without waiting between routes.
 */
export const PageTransition = ({ children }: Props) => (
  <div className="page-transition">{children}</div>
);