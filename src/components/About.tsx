import { Leaf, Award, Users, Recycle, Wind, TreePine } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";

export const About = () => {
  const { t } = usePageContent("home");
  const aboutTitle = t("about_title", "Movidos por propósito.");
  const aboutParagraph = t(
    "about_paragraph",
    "A Filadelfo Motors nasceu da convicção de que a mobilidade urbana precisa ser silenciosa, inteligente e elétrica. Desenhamos cada modelo para durar e pedalar mais longe."
  );
  // Highlight the LAST 1–2 words in red. If the title has 4+ words, paint the
  // last two for visual balance (avoids a single short word stranded on its own line).
  const words = aboutTitle.trim().split(/\s+/);
  const highlightCount = words.length >= 4 ? 2 : 1;
  const titleA = words.slice(0, words.length - highlightCount).join(" ");
  const titleB = words.slice(words.length - highlightCount).join(" ");
  const stats = [
    { v: "359", l: "Clientes" },
    { v: "98%", l: "Satisfação" },
    { v: "100%", l: "Atendimento humano" },
    { v: "0g", l: "CO₂ por km" },
  ];

  const values = [
    {
      icon: Leaf,
      t: "Sustentabilidade",
      d: "Cada Filadelfo na rua é menos um motor a combustão emitindo CO₂.",
    },
    {
      icon: Award,
      t: "Qualidade premium",
      d: "Componentes selecionados, motores brushless e baterias de lítio certificadas.",
    },
    {
      icon: Users,
      t: "Comunidade",
      d: "Eventos, rotas guiadas e suporte direto com quem entende de bike elétrica.",
    },
  ];

  return (
    <section id="sobre" className="relative section-y bg-background overflow-hidden">
      <div className="container mx-auto grid md:grid-cols-12 gap-10 md:gap-12 px-4 sm:px-6">
        <div className="md:col-span-5 md:sticky md:top-32 md:self-start">
          <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground font-medium">
            Sobre nós
          </span>
          <h2 className="font-display text-[2.25rem] leading-[0.95] sm:text-5xl md:text-7xl uppercase mt-4 md:mt-5 text-balance">
            {titleA}
            {titleB && (
              <>
                {" "}
                <span className="text-brand-red">{titleB}</span>
              </>
            )}
          </h2>
          <p className="mt-5 md:mt-6 text-muted-foreground leading-relaxed text-sm md:text-base max-w-prose">
            {aboutParagraph}
          </p>

          <div className="mt-8 md:mt-10 grid grid-cols-2 gap-x-4 gap-y-6 md:gap-6">
            {stats.map((s) => (
              <div key={s.l} className="border-t border-border pt-3 md:pt-4 min-w-0">
                <div className="font-display text-3xl md:text-4xl text-foreground leading-none">{s.v}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-2 leading-tight">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-7 space-y-4 md:space-y-5">
          {values.map(({ icon: Icon, t, d }, i) => (
            <div
              key={t}
              className="group bg-card border border-border p-6 sm:p-8 md:p-10 rounded-md hover:border-foreground/30 transition-all"
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div className="size-12 md:size-14 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0 group-hover:bg-foreground group-hover:border-foreground transition-all">
                  <Icon className="size-5 md:size-6 text-foreground group-hover:text-background transition-colors" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-2xl md:text-3xl uppercase mb-2 md:mb-3">{t}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{d}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bloco: compromisso com o meio ambiente */}
      <div className="container mx-auto px-4 sm:px-6 mt-14 md:mt-28">
        <div className="relative overflow-hidden rounded-lg border border-border bg-secondary/50 p-5 sm:p-10 md:p-14">
          <div className="relative grid md:grid-cols-12 gap-8 md:gap-12 items-start">
            <div className="md:col-span-5">
              <span className="inline-flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.4em] uppercase text-muted-foreground font-medium">
                <Leaf className="size-3.5" />
                Planeta em primeiro lugar
              </span>
              <h3 className="font-display text-[1.75rem] leading-[1] sm:text-4xl md:text-6xl uppercase mt-4 md:mt-5 md:leading-[0.95] text-balance">
                Mobilidade que{" "}
                <span className="text-brand-red">respira melhor</span>.
              </h3>
              <p className="mt-5 md:mt-6 text-muted-foreground leading-relaxed text-sm md:text-base max-w-prose">
                Na Filadelfo Motors, cada bicicleta elétrica é um manifesto
                silencioso a favor do planeta. Acreditamos que o futuro das
                cidades passa por escolhas conscientes — menos combustão, menos
                ruído, menos pressa cinzenta. Mais ar puro, mais espaço para o
                que importa.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed text-sm md:text-base max-w-prose">
                Trabalhamos com fornecedores que compartilham nossos valores,
                priorizamos componentes duráveis e recicláveis e desenhamos
                cada modelo para durar anos — porque o produto mais sustentável
                é aquele que você não precisa trocar.
              </p>
            </div>

            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {[
                {
                  icon: Wind,
                  t: "Zero emissão",
                  d: "100% elétrico, sem combustão fóssil. Ar mais limpo a cada trajeto.",
                },
                {
                  icon: Recycle,
                  t: "Ciclo responsável",
                  d: "Baterias com programa de coleta e componentes pensados para reciclagem.",
                },
                {
                  icon: TreePine,
                  t: "Compromisso real",
                  d: "Parcerias de reflorestamento para neutralizar nossa pegada operacional.",
                },
              ].map(({ icon: Icon, t, d }) => (
                <div
                  key={t}
                  className="group bg-background border border-border rounded-md p-5 md:p-6 hover:border-foreground/30 transition-all flex flex-col"
                >
                  <div className="size-10 md:size-12 rounded-md bg-secondary border border-border flex items-center justify-center mb-4 group-hover:bg-foreground group-hover:border-foreground transition-all shrink-0">
                    <Icon className="size-5 text-foreground group-hover:text-background transition-colors" />
                  </div>
                  <h4 className="font-display text-lg md:text-xl uppercase mb-2 leading-tight">{t}</h4>
                  <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
