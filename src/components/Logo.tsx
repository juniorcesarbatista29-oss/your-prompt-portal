import { Link } from "react-router-dom";
import logo from "@/assets/filadelfo-logo.webp";

type LogoProps = {
  className?: string;
  /**
   * "auto"  – preto + vermelho (uso em fundos claros / brancos)
   * "light" – força versão clara (branca) para fundos escuros ou coloridos
   */
  variant?: "auto" | "light";
};

export const Logo = ({ className = "", variant = "auto" }: LogoProps) => {
  // Em "light" invertemos a imagem (preto -> branco). O vermelho fica
  // levemente esverdeado ao inverter, então usamos hue-rotate para
  // devolver para o vermelho/branco harmônico.
  const filterClass =
    variant === "light"
      ? "[filter:invert(1)_hue-rotate(180deg)_saturate(2)] brightness-110"
      : "";

  return (
    <Link
      to="/"
      className={`flex items-center group ${className}`}
      aria-label="Filadelfo Motors"
    >
      <img
        src={logo}
        alt="Filadelfo Motors — bicicletas elétricas premium"
        width={1311}
        height={285}
        className={`h-9 sm:h-10 md:h-12 w-auto object-contain transition-opacity group-hover:opacity-80 ${filterClass}`}
        loading="eager"
        decoding="async"
      />
    </Link>
  );
};
