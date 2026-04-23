export const Marquee = () => {
  const items = [
    "Entrega para todo o Brasil",
    "Garantia de 6 meses",
    "Parcelamento em até 24x",
    "Frete grátis acima de R$ 5.000",
    "Suporte técnico especializado",
    "Test ride em loja",
  ];
  const repeated = [...items, ...items];

  return (
    <div className="bg-foreground text-background py-3 md:py-3.5 overflow-hidden">
      <div className="flex marquee gap-10 md:gap-16 whitespace-nowrap">
        {repeated.map((t, i) => (
          <div
            key={i}
            className="flex items-center gap-10 md:gap-16 text-[11px] md:text-xs font-medium uppercase tracking-[0.25em]"
          >
            <span>{t}</span>
            <span className="size-1 rounded-full bg-background/40" aria-hidden />
          </div>
        ))}
      </div>
    </div>
  );
};
