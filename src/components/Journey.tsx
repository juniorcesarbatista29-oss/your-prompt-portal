import { ArrowUpRight } from "lucide-react";

export const Journey = () => {
  const steps = [
    {
      n: "01",
      t: "Escolha o seu modelo",
      d: "Do urbano leve ao moped potente: encontre a bike que combina com sua rotina.",
    },
    {
      n: "02",
      t: "Personalize a compra",
      d: "Cor, acessórios e plano de financiamento sob medida em até 24 vezes.",
    },
    {
      n: "03",
      t: "Receba e pedale",
      d: "Entregamos montada e revisada. Suporte técnico vitalício pela Filadelfo.",
    },
  ];

  return (
    <section id="jornada" className="relative section-y-tight bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-end mb-10 md:mb-16">
          <div className="md:col-span-7">
            <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground font-medium">
              Sua jornada elétrica começa aqui
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-7xl uppercase mt-4 md:mt-5 leading-[0.9] text-balance">
              Três passos.
              <br />
              Zero <span className="text-brand-red">emissão</span>.
            </h2>
          </div>
          <div className="md:col-span-5 md:text-right">
            <p className="text-muted-foreground max-w-md md:ml-auto text-sm md:text-base">
              Compramos para você uma experiência completa — da escolha à
              primeira pedalada elétrica. Tudo em um só lugar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group bg-background p-6 sm:p-8 md:p-10 hover:bg-card transition-colors relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-6 md:mb-8">
                <span className="font-display text-5xl md:text-6xl text-brand-red">
                  {s.n}
                </span>
                <ArrowUpRight className="size-5 md:size-6 text-muted-foreground group-hover:text-brand-red group-hover:rotate-45 transition-all" />
              </div>
              <h3 className="font-display text-xl md:text-2xl uppercase mb-3">{s.t}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.d}
              </p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-brand-red group-hover:w-full transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
