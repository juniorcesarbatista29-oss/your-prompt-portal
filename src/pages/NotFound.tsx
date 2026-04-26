import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useCanonical } from "@/hooks/useCanonical";

const NotFound = () => {
  const location = useLocation();
  useCanonical(location.pathname, {
    title: "Página não encontrada | Filadelfo Motors",
    description:
      "A página que você procura não existe. Volte ao início e descubra as bicicletas elétricas premium da Filadelfo Motors.",
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    // Tell crawlers not to index 404s
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    const previous = robots.getAttribute("content");
    robots.setAttribute("content", "noindex, follow");
    return () => {
      if (previous) robots?.setAttribute("content", previous);
      else robots?.remove();
    };
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center px-4">
        <p className="mb-2 font-display text-6xl md:text-7xl text-muted-foreground">404</p>
        <h1 className="mb-4 font-display text-3xl md:text-4xl uppercase">
          Página não encontrada
        </h1>
        <p className="mb-6 text-base text-muted-foreground">
          A página que você procura não existe. Volte ao início e descubra nossas bicicletas elétricas.
        </p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Voltar para a página inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;
