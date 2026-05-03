import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

/**
 * Top-level boundary so a single render error doesn't blank the whole site.
 * Catches errors during render in any child route and shows a graceful fallback.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  reset = () => {
    this.setState({ hasError: false });
    if (typeof window !== "undefined") window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-[100svh] bg-background text-foreground flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-4">
            Filadelfo Motors
          </div>
          <h1 className="font-display uppercase text-3xl sm:text-4xl leading-tight">
            Algo saiu do <span className="text-brand-red">trilho.</span>
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Tivemos um problema ao carregar esta página. Tente novamente em instantes.
          </p>
          <button
            type="button"
            onClick={this.reset}
            className="mt-6 inline-flex items-center justify-center px-5 py-3 rounded-full bg-foreground text-background text-[11px] tracking-widest uppercase font-semibold hover:bg-brand-red hover:text-primary-foreground transition-colors"
          >
            Recarregar
          </button>
        </div>
      </main>
    );
  }
}
