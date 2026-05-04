import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useCanonical } from "@/hooks/useCanonical";

const Privacidade = () => {
  useCanonical("/privacidade", {
    title: "Política de Privacidade | Filadelfo Motors",
    description:
      "Entenda de forma simples como a Filadelfo Motors trata os seus dados pessoais, sempre com transparência e em conformidade com a LGPD.",
  });

  const updated = "04 de maio de 2026";

  return (
    <PageTransition>
      <main className="min-h-screen bg-background text-foreground">
        <Header />
        <article className="pt-28 md:pt-36 pb-20 md:pb-28">
          <div className="container mx-auto px-4 max-w-3xl">
            <header className="mb-10 md:mb-14 border-b border-border pb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">
                Documento legal
              </p>
              <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.95] mb-4">
                Política de Privacidade
              </h1>
              <p className="text-sm text-muted-foreground">
                Última atualização: {updated}
              </p>
            </header>

            <div className="space-y-10 text-[15px] leading-relaxed text-foreground/85">
              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  1. Sobre esta política
                </h2>
                <p>
                  A <strong>Filadelfo Motors</strong> valoriza a sua confiança e
                  preza pela transparência no relacionamento com clientes e
                  visitantes. Este documento explica, de forma simples, quais
                  informações coletamos, como elas são utilizadas e quais são
                  os seus direitos, sempre em conformidade com a Lei Geral de
                  Proteção de Dados (LGPD — Lei nº 13.709/2018).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  2. Informações que coletamos
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Dados de contato:</strong> nome, telefone, e-mail e
                    cidade, fornecidos por você em formulários ou pelo
                    WhatsApp.
                  </li>
                  <li>
                    <strong>Dados de navegação:</strong> informações técnicas
                    como tipo de dispositivo, navegador e páginas visitadas,
                    coletadas automaticamente para melhorar a sua experiência.
                  </li>
                  <li>
                    <strong>Interesses:</strong> mensagens enviadas e modelos
                    de bikes que despertaram seu interesse.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  3. Como usamos suas informações
                </h2>
                <p>
                  Usamos seus dados para responder ao seu contato, apresentar
                  modelos e condições, enviar novidades relevantes e aprimorar
                  o nosso site. Suas informações são tratadas com cuidado e
                  nunca são vendidas a terceiros.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  4. Compartilhamento
                </h2>
                <p>
                  Compartilhamos dados apenas com parceiros essenciais para o
                  funcionamento do site e do nosso atendimento (como serviços
                  de hospedagem, comunicação e análise), todos comprometidos
                  com a confidencialidade das suas informações.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  5. Cookies
                </h2>
                <p>
                  Utilizamos cookies para que o site funcione corretamente,
                  lembrar suas preferências e entender quais conteúdos são
                  mais úteis. Você pode gerenciá-los a qualquer momento nas
                  configurações do seu navegador.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  6. Seus direitos
                </h2>
                <p>
                  Você é o titular dos seus dados e pode, quando quiser,
                  solicitar acesso, correção, atualização, portabilidade ou
                  exclusão das suas informações, bem como retirar o seu
                  consentimento. Basta entrar em contato pelos canais abaixo —
                  o atendimento é simples e sem burocracia.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  7. Segurança
                </h2>
                <p>
                  Adotamos boas práticas técnicas e organizacionais para
                  manter as suas informações protegidas e acessíveis apenas a
                  quem precisa utilizá-las no atendimento ao cliente.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  8. Atualizações
                </h2>
                <p>
                  Esta política pode ser atualizada de tempos em tempos para
                  refletir melhorias no site ou novas exigências legais. A
                  versão mais recente estará sempre disponível nesta página.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  9. Fale com a gente
                </h2>
                <p>
                  Se tiver qualquer dúvida sobre esta política ou sobre o uso
                  dos seus dados, é só falar com a gente:
                </p>
                <ul className="mt-3 space-y-1">
                  <li>
                    E-mail:{" "}
                    <a
                      href="mailto:contato@filadelfomotors.com.br"
                      className="text-brand-red hover:underline"
                    >
                      contato@filadelfomotors.com.br
                    </a>
                  </li>
                  <li>
                    WhatsApp:{" "}
                    <a
                      href="https://wa.me/5517996015317"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-red hover:underline"
                    >
                      (17) 99601-5317
                    </a>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </article>
        <Footer />
      </main>
    </PageTransition>
  );
};

export default Privacidade;
