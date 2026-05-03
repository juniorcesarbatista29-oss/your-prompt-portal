import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useCanonical } from "@/hooks/useCanonical";

const Privacidade = () => {
  useCanonical("/privacidade", {
    title: "Política de Privacidade | Filadelfo Motors",
    description:
      "Saiba como a Filadelfo Motors coleta, utiliza, armazena e protege seus dados pessoais em conformidade com a LGPD.",
  });

  const updated = "03 de maio de 2026";

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
                  1. Introdução
                </h2>
                <p>
                  A <strong>Filadelfo Motors</strong> respeita a sua privacidade e
                  está comprometida em proteger os dados pessoais dos seus
                  usuários e clientes. Esta Política descreve como coletamos,
                  utilizamos, armazenamos e protegemos suas informações, em
                  conformidade com a Lei Geral de Proteção de Dados Pessoais
                  (Lei nº 13.709/2018 — LGPD).
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  2. Dados que coletamos
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Dados de contato:</strong> nome, telefone, e-mail e
                    cidade, fornecidos voluntariamente em formulários ou via
                    WhatsApp.
                  </li>
                  <li>
                    <strong>Dados de navegação:</strong> endereço IP, tipo de
                    dispositivo, navegador e páginas visitadas, coletados
                    automaticamente através de cookies e ferramentas de
                    análise.
                  </li>
                  <li>
                    <strong>Dados de interação:</strong> mensagens enviadas,
                    interesses por modelos e preferências de comunicação.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  3. Como utilizamos seus dados
                </h2>
                <p>
                  Utilizamos suas informações para responder solicitações,
                  apresentar produtos, enviar ofertas relevantes, melhorar a
                  experiência no site e cumprir obrigações legais. Não vendemos
                  ou alugamos seus dados a terceiros.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  4. Compartilhamento
                </h2>
                <p>
                  Seus dados podem ser compartilhados apenas com prestadores de
                  serviço essenciais (hospedagem, comunicação, analytics) que
                  seguem padrões adequados de segurança, ou quando exigido por
                  autoridades competentes.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  5. Cookies
                </h2>
                <p>
                  Utilizamos cookies para garantir o funcionamento do site,
                  lembrar preferências e medir o desempenho de páginas. Você
                  pode desativá-los nas configurações do seu navegador, ciente
                  de que isso pode afetar a experiência de uso.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  6. Seus direitos
                </h2>
                <p>
                  Conforme a LGPD, você pode solicitar a qualquer momento:
                  confirmação do tratamento, acesso, correção, anonimização,
                  portabilidade ou exclusão dos seus dados, bem como revogar o
                  consentimento. Para exercer seus direitos, entre em contato
                  pelo e-mail abaixo.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  7. Segurança
                </h2>
                <p>
                  Adotamos medidas técnicas e administrativas para proteger
                  seus dados contra acessos não autorizados, perda, alteração
                  ou destruição. Ainda assim, nenhum sistema é 100% seguro, e
                  recomendamos cautela ao compartilhar informações pessoais.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  8. Alterações
                </h2>
                <p>
                  Esta Política pode ser atualizada periodicamente. A versão
                  vigente estará sempre disponível nesta página, com a data da
                  última atualização indicada no topo.
                </p>
              </section>

              <section>
                <h2 className="font-display text-2xl uppercase tracking-wide mb-3 text-foreground">
                  9. Contato
                </h2>
                <p>
                  Para dúvidas sobre esta Política ou sobre o tratamento dos
                  seus dados, fale conosco:
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
                  <li>WhatsApp: (17) 99215-5535</li>
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
