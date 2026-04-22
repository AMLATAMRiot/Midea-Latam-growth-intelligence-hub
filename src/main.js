import React, { useEffect, useMemo, useState } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import { motion } from "https://esm.sh/framer-motion@11.11.9";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "https://esm.sh/recharts@2.13.3";

const html = htm.bind(React.createElement);

const colors = {
  bg: "#0d0d0d",
  panel: "#171717",
  ink: "#f5f5f5",
  muted: "#a3a3a3",
  amber: "#f2c230",
  amberSoft: "#f6d665",
  gray: "#525252",
  steel: "#c4c4c4"
};

const logos = {
  riot: "./src/assets/logos/riot-logo.png",
  midea: "./src/assets/logos/midea-logo.png"
};

const currency = (value, digits = 0, compact = true) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);

const number = (value, digits = 0) =>
  new Intl.NumberFormat("es-CO", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value);

const percent = (value, digits = 0) =>
  `${new Intl.NumberFormat("es-CO", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  }).format(value * 100)}%`;

const sectionIntro = {
  hero: "Propuesta ejecutiva",
  context: "Momento de negocio",
  proof: "Por qué seguir con nosotros",
  insights: "Señales Q1",
  colombia: "Caso Colombia",
  mexico: "Aprendizajes de México",
  system: "Sistema regional",
  services: "Servicios y modelo",
  countries: "Ruta del clúster",
  advantage: "Ventaja de agencia",
  impact: "Impacto esperado",
  closing: "Cierre"
};

const navItems = [
  { id: "hero", label: "Inicio" },
  { id: "context", label: "Momento" },
  { id: "proof", label: "Continuidad" },
  { id: "insights", label: "Datos" },
  { id: "colombia", label: "Colombia" },
  { id: "mexico", label: "México" },
  { id: "system", label: "Sistema" },
  { id: "services", label: "Servicios" },
  { id: "countries", label: "Clúster" },
  { id: "advantage", label: "Agencia" },
  { id: "impact", label: "Impacto" },
  { id: "closing", label: "Cierre" }
];

function App() {
  const [data, setData] = useState(null);
  const [activeCountry, setActiveCountry] = useState("co");
  const [insightView, setInsightView] = useState("paid");
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    fetch("./src/data/mideaData.json")
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("[data-section]"));
    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target?.id) {
          setActiveSection(visible.target.id);
        }
      },
      { threshold: [0.25, 0.45, 0.7] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [data]);

  const currentCountry = useMemo(
    () => data?.countries.find((country) => country.id === activeCountry),
    [activeCountry, data]
  );

  if (!data) {
    return html`
      <main className="min-h-screen flex items-center justify-center bg-[#0b0b0b] px-6 text-white">
        <div className="glass-panel rounded-[32px] border border-white/10 px-10 py-12 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-neutral-400">Cargando propuesta</p>
          <h1 className="mt-4 font-serif text-4xl">Preparando la nueva versión estratégica.</h1>
        </div>
      </main>
    `;
  }

  const progressIndex = navItems.findIndex((item) => item.id === activeSection);
  const progressPct = progressIndex > -1 ? ((progressIndex + 1) / navItems.length) * 100 : 0;

  const paidChartData = data.paid_media_country.map((item) => ({
    mercado: item.country,
    inversion: item.executed_budget_mxn,
    ingresos: item.revenue_mxn
  }));

  const webTrafficData = data.web_traffic_country.map((item) => ({
    mercado: item.country,
    sesiones: item.sessions,
    paginas: item.pages_per_session
  }));

  const seoData = data.seo_country.map((item) => ({
    mercado: item.country,
    top10: Math.round(item.top10_share * 100),
    trafico: item.estimated_traffic
  }));

  const mexicoObjectives = data.paid_media_objective.filter((item) => item.country === "MX");
  const sourceMix = data.web_top_sources.filter((item) => item.country === "CO");

  return html`
    <div className="app-shell relative min-h-screen bg-[#090909] text-white">
      <header className="fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="glass-panel rounded-full border border-white/10 px-4 py-3 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 items-center rounded-full bg-black px-4">
                  <img src=${logos.riot} alt="RIOT" className="h-6 w-auto object-contain" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">para</span>
                <div className="flex h-10 items-center rounded-full bg-white px-4">
                  <img src=${logos.midea} alt="Midea" className="h-6 w-auto object-contain" />
                </div>
              </div>
              <div className="hidden h-8 w-px bg-white/10 md:block"></div>
              <div className="hidden md:block">
                <p className="text-[10px] uppercase tracking-[0.34em] text-neutral-500">Hub estratégico regional</p>
                <p className="text-sm font-semibold text-white">Presentado por RIOT para Midea</p>
              </div>
            </div>
          </div>
          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/45 px-2 py-2 shadow-2xl xl:flex">
            ${navItems.slice(0, 6).map(
              (item) => html`
                <button
                  key=${item.id}
                  className=${`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    activeSection === item.id ? "bg-[#f2c230] text-black" : "text-neutral-400 hover:text-white"
                  }`}
                  onClick=${() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  ${item.label}
                </button>
              `
            )}
          </nav>
        </div>
      </header>

      <aside className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
        <div className="glass-panel flex items-center gap-4 rounded-[28px] border border-white/10 px-4 py-5 shadow-2xl">
          <div className="progress-rail relative h-56 w-1 overflow-hidden rounded-full">
            <div className="progress-bar absolute inset-x-0 bottom-0 rounded-full" style=${{ height: `${progressPct}%` }}></div>
          </div>
          <div className="flex flex-col gap-2">
            ${navItems.map(
              (item) => html`
                <button
                  key=${item.id}
                  className=${`text-left text-xs font-semibold transition ${
                    activeSection === item.id ? "text-[#f2c230]" : "text-neutral-500"
                  }`}
                  onClick=${() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  ${item.label}
                </button>
              `
            )}
          </div>
        </div>
      </aside>

      <main className="relative z-10">
        <${Section}
          id="hero"
          eyebrow=${sectionIntro.hero}
          title="La oportunidad no es cambiar de agencia. Es convertir la continuidad en ventaja competitiva para Colombia."
          subtitle=${data.meta.subtitle}
          description="Esta propuesta redefine la conversación: no venimos a ofrecer solo servicios de marketing. Venimos a demostrar por qué somos el mejor socio para sostener la cuenta, consolidar Colombia y escalar el nuevo clúster con una lógica regional ya aprendida."
          className="pt-28 md:pt-36"
        >
          <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="space-y-6">
              <div className="glass-panel floating-card rounded-[34px] border border-white/10 p-7 shadow-2xl md:p-9">
                <div className="mb-8 flex flex-wrap items-center gap-4">
                  <div className="rounded-full border border-white/10 bg-black px-5 py-3">
                    <img src=${logos.riot} alt="RIOT presenta" className="h-8 w-auto object-contain" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">presenta para</span>
                  <div className="rounded-full border border-white/10 bg-white px-5 py-3">
                    <img src=${logos.midea} alt="Midea" className="h-8 w-auto object-contain" />
                  </div>
                </div>
                <p className="text-sm font-medium uppercase tracking-[0.28em] text-neutral-500">Tesis principal</p>
                <h2 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-6xl">
                  Ya existe contexto, ya existe aprendizaje y ya existe evidencia. La mejor decisión es capitalizarlo.
                </h2>
                <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-300 md:text-lg">
                  México ya validó un modelo de crecimiento. Colombia ya muestra señales de demanda eficiente. Nuestro valor está en unir ambos mundos y convertir esa continuidad en un motor regional con más claridad, más velocidad y menos fricción.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <${Badge} text="Todo en español" tone="amber" />
                  <${Badge} text="Enfoque de retención" tone="dark" />
                  <${Badge} text="Aprendizajes México + LATAM" tone="gray" />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                ${data.hero_kpis.map(
                  (kpi) => html`<${MetricCard} key=${kpi.label} title=${kpi.label} value=${kpi.value} detail=${kpi.detail} />`
                )}
              </div>
            </div>

            <div className="glass-panel rounded-[34px] border border-white/10 p-7 shadow-2xl md:p-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">Qué queremos que el cliente entienda</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-neutral-400">
                  Actualizado ${data.meta.updated_at}
                </span>
              </div>
              <div className="mt-6 space-y-4">
                <${DecisionRow}
                  title="No somos una agencia nueva compitiendo por promesas"
                  body="Somos el equipo que ya conoce la cuenta, ya aprendió del ecosistema y puede convertir ese conocimiento en mejores decisiones."
                />
                <${DecisionRow}
                  title="Colombia no necesita reinicio"
                  body="Necesita una estructura más poderosa para rentabilizar la demanda que ya existe."
                />
                <${DecisionRow}
                  title="La continuidad tiene valor económico"
                  body="Reduce la curva de aprendizaje, protege velocidad de ejecución y mejora la calidad de la expansión regional."
                />
              </div>
              <div className="mt-8 rounded-[28px] border border-[#f2c230]/25 bg-[#f2c230]/10 px-6 py-6">
                <p className="text-xs uppercase tracking-[0.32em] text-[#f2c230]">Mensaje ejecutivo</p>
                <p className="mt-3 text-2xl font-semibold leading-tight text-white">
                  La cuenta debe evolucionar de ejecución táctica a crecimiento regional con memoria.
                </p>
              </div>
            </div>
          </div>
        </${Section}>

        <${Section}
          id="context"
          eyebrow=${sectionIntro.context}
          title="Este momento importa porque Colombia ya tiene base, y cambiar de socio ahora diluye valor."
          description="La conversación correcta no es si hace falta una agencia. La conversación correcta es qué socio puede convertir contexto previo en una ventaja más rentable para la siguiente etapa."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            ${data.context_blocks.map(
              (item, index) => html`<${InsightPanel} key=${item.title} index=${index + 1} title=${item.title} body=${item.body} />`
            )}
          </div>
        </${Section}>

        <${Section}
          id="proof"
          eyebrow=${sectionIntro.proof}
          title="Nuestra continuidad tiene tres argumentos fuertes: contexto, aprendizaje y velocidad."
          description="Si el objetivo es convencer a Colombia de seguir con nosotros, esta es la parte central de la historia: ya sabemos más, ya probamos más y podemos movernos más rápido que cualquier reemplazo."
        >
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="grid gap-4">
              ${data.continuity_proof.map(
                (item) => html`
                  <div key=${item.title} className="signal-card glass-panel rounded-[28px] border border-white/10 p-6 shadow-2xl">
                    <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">Argumento de continuidad</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">${item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-300">${item.body}</p>
                  </div>
                `
              )}
            </div>
            <div className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Qué perdería el cliente si cambia</p>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                <${ModelColumn}
                  title="Si cambia de agencia"
                  tone="soft"
                  items=${[
                    "Nueva curva de onboarding",
                    "Pérdida de aprendizaje histórico",
                    "Más tiempo para llegar a criterio regional",
                    "Mayor riesgo de tácticas sin contexto"
                  ]}
                />
                <${ModelColumn}
                  title="Si continúa con nosotros"
                  tone="amber"
                  items=${[
                    "Aceleración inmediata en Colombia",
                    "Playbook regional ya construido",
                    "Mejor lectura de señales por mercado",
                    "Escalamiento con más consistencia"
                  ]}
                />
              </div>
            </div>
          </div>
        </${Section}>

        <${Section}
          id="insights"
          eyebrow=${sectionIntro.insights}
          title="Los datos de Q1 no solo muestran desempeño. Muestran la ruta."
          description="La lectura correcta es simple: México ya valida el modelo, Colombia ya muestra el potencial y el clúster necesita una agencia capaz de conectar ambos puntos."
        >
          <div className="flex flex-wrap gap-3">
            <${FilterPill} label="Medios pagados" active=${insightView === "paid"} onClick=${() => setInsightView("paid")} />
            <${FilterPill} label="Demanda web" active=${insightView === "web"} onClick=${() => setInsightView("web")} />
            <${FilterPill} label="SEO" active=${insightView === "seo"} onClick=${() => setInsightView("seo")} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl md:p-8">
              ${insightView === "paid" &&
              html`
                <${ChartHeader}
                  title="Inversión vs. monetización"
                  body="México convierte inversión en ingresos reales. Colombia ya merece una arquitectura más sofisticada para acercarse a esa lógica."
                />
                <${ChartWrap}>
                  <${ResponsiveContainer} width="100%" height=${330}>
                    <${BarChart} data=${paidChartData} barGap=${16}>
                      <${CartesianGrid} vertical=${false} />
                      <${XAxis} dataKey="mercado" tick=${axisTick} tickLine=${false} axisLine=${false} />
                      <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false} tickFormatter=${(value) => currency(value)} width=${95} />
                      <${Tooltip} content=${ChartTooltip} />
                      <${Bar} dataKey="inversion" name="Inversión" radius=${[8, 8, 0, 0]} fill=${colors.gray} />
                      <${Bar} dataKey="ingresos" name="Ingresos" radius=${[8, 8, 0, 0]} fill=${colors.amber} />
                    </${BarChart}>
                  </${ResponsiveContainer}>
                </${ChartWrap}>
              `}

              ${insightView === "web" &&
              html`
                <${ChartHeader}
                  title="Profundidad del tráfico"
                  body="México ya refleja una experiencia más madura. Colombia tiene volumen y eficiencia, pero todavía puede mejorar su capacidad de convertir interés en navegación útil."
                />
                <${ChartWrap}>
                  <${ResponsiveContainer} width="100%" height=${330}>
                    <${AreaChart} data=${webTrafficData}>
                      <defs>
                        <linearGradient id="sesionesFill" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="5%" stopColor=${colors.amber} stopOpacity="0.45" />
                          <stop offset="95%" stopColor=${colors.amber} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <${CartesianGrid} vertical=${false} />
                      <${XAxis} dataKey="mercado" tick=${axisTick} tickLine=${false} axisLine=${false} />
                      <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false} tickFormatter=${(value) => number(value)} width=${75} />
                      <${Tooltip} content=${ChartTooltip} />
                      <${Area} type="monotone" dataKey="sesiones" name="Sesiones" stroke=${colors.amber} strokeWidth=${3} fill="url(#sesionesFill)" />
                    </${AreaChart}>
                  </${ResponsiveContainer}>
                </${ChartWrap}>
              `}

              ${insightView === "seo" &&
              html`
                <${ChartHeader}
                  title="Madurez orgánica"
                  body="La distancia entre México y Colombia en visibilidad orgánica refuerza una idea: el siguiente salto no es solo pauta; también es estructura digital."
                />
                <${ChartWrap}>
                  <${ResponsiveContainer} width="100%" height=${330}>
                    <${BarChart} data=${seoData}>
                      <${CartesianGrid} vertical=${false} />
                      <${XAxis} dataKey="mercado" tick=${axisTick} tickLine=${false} axisLine=${false} />
                      <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false} />
                      <${Tooltip} content=${ChartTooltip} />
                      <${Bar} dataKey="top10" name="Share Top 10" radius=${[8, 8, 0, 0]}>
                        ${seoData.map(
                          (entry, index) =>
                            html`<${Cell} key=${`${entry.mercado}-${index}`} fill=${index === 1 ? colors.amber : colors.gray} />`
                        )}
                      </${Bar}>
                    </${BarChart}>
                  </${ResponsiveContainer}>
                </${ChartWrap}>
              `}
            </div>

            <div className="space-y-5">
              <${InsightSummary}
                title="Lectura ejecutiva"
                points=${[
                  "México prueba que el modelo regional puede generar resultados de negocio, no solo métricas intermedias.",
                  "Colombia es hoy la mejor oportunidad para transformar una operación eficiente en una operación más rentable.",
                  "La agencia ideal para esta etapa es la que ya conoce el recorrido y puede acelerar sin reconstruir desde cero."
                ]}
              />
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                ${data.q1_kpi_summary.map(
                  (item) => html`
                    <div key=${item.country} className="glass-panel rounded-[28px] border border-white/10 p-5 shadow-2xl">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">${item.country}</p>
                          <p className="mt-2 text-2xl font-semibold text-white">${currency(item.investment_mxn)}</p>
                        </div>
                        <span className="rounded-full bg-[#f2c230]/12 px-3 py-1 text-xs font-semibold text-[#f2c230]">
                          ${item.conversion_cpa_mxn ? `CPA ${currency(item.conversion_cpa_mxn, 2, false)}` : `CPC ${currency(item.consideration_cpc_mxn, 2, false)}`}
                        </span>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-neutral-300">${item.key_insight}</p>
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        </${Section}>

        <${Section}
          id="colombia"
          eyebrow=${sectionIntro.colombia}
          title="Colombia no es un problema por resolver. Es una oportunidad lista para estructurarse mejor."
          description=${data.colombia_case.headline}
        >
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="glass-panel rounded-[32px] border border-white/10 p-7 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">Qué está frenando el crecimiento hoy</p>
              <div className="mt-6 space-y-4">
                ${data.pain_points.map(
                  (item) => html`
                    <div key=${item.title} className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-5">
                      <p className="text-lg font-semibold text-white">${item.title}</p>
                      <p className="mt-3 text-sm leading-7 text-neutral-300">${item.detail}</p>
                      <p className="mt-4 rounded-2xl bg-[#f2c230]/10 px-4 py-3 text-sm font-semibold text-[#f2c230]">${item.impact}</p>
                    </div>
                  `
                )}
              </div>
            </div>
            <div className="space-y-5">
              <div className="glass-panel rounded-[32px] border border-white/10 p-7 shadow-2xl">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">Señales más relevantes</p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  ${data.colombia_case.signals.map(
                    (signal) => html`<${MiniStat} key=${signal.label} title=${signal.label} value=${signal.value} body="" compact=${true} />`
                  )}
                </div>
              </div>
              <${SourceMixCard} title="Composición del tráfico en Colombia" data=${sourceMix} />
              <${ListPanel} title="Qué proponemos hacer en Colombia" items=${data.colombia_case.opportunities} />
            </div>
          </div>
        </${Section}>

        <${Section}
          id="mexico"
          eyebrow=${sectionIntro.mexico}
          title="México es nuestra principal ventaja: ya existe un benchmark real dentro de Midea."
          description="No proponemos copiar México literalmente. Proponemos usar su aprendizaje como atajo estratégico para Colombia y el clúster."
        >
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="space-y-5">
              <${BenchmarkCard}
                title="Arquitectura de medios"
                body="México ya opera con awareness, consideration y conversion; eso nos da un modelo concreto de secuencia y asignación."
                stat="3 objetivos"
              />
              <${BenchmarkCard}
                title="Capacidad de monetización"
                body="La capa de conversión ya logra ROAS alto. Ese aprendizaje es un activo para redefinir Colombia."
                stat="20.69x"
              />
              <${BenchmarkCard}
                title="Madurez orgánica"
                body="La visibilidad SEO mexicana demuestra cómo un ecosistema bien estructurado reduce fricción de adquisición con el tiempo."
                stat="93% top 10"
              />
            </div>

            <div className="space-y-5">
              <div className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl md:p-8">
                <${ChartHeader}
                  title="Canales ecommerce en México"
                  body="La lectura no es solo volumen: la arquitectura de commerce ya está demostrada y puede inspirar prioridades regionales."
                />
                <${ChartWrap}>
                  <${ResponsiveContainer} width="100%" height=${280}>
                    <${BarChart} data=${data.ecommerce_mx_channels} layout="vertical" margin=${{ left: 16, right: 12 }}>
                      <${CartesianGrid} horizontal=${false} />
                      <${XAxis} type="number" tick=${axisTick} tickLine=${false} axisLine=${false} tickFormatter=${(value) => currency(value)} />
                      <${YAxis} type="category" dataKey="channel" width=${120} tick=${axisTick} tickLine=${false} axisLine=${false} />
                      <${Tooltip} content=${ChartTooltip} />
                      <${Bar} dataKey="revenue_mxn" name="Ingresos" radius=${[0, 10, 10, 0]} fill=${colors.amber} />
                    </${BarChart}>
                  </${ResponsiveContainer}>
                </${ChartWrap}>
              </div>

              <div className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl md:p-8">
                <${ChartHeader}
                  title="Inversión por objetivo en México"
                  body="La fuerza de México está en la integración del funnel. Esa es precisamente la conversación que proponemos abrir en Colombia."
                />
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  ${mexicoObjectives.map(
                    (item) => html`
                      <div key=${item.objective} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                        <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">${item.objective}</p>
                        <p className="mt-3 text-3xl font-semibold text-white">${currency(item.spend_mxn)}</p>
                        <p className="mt-3 text-sm leading-7 text-neutral-300">
                          ${item.objective === "Conversion"
                            ? `Ya entrega ${item.roas_label} de retorno.`
                            : "Cumple una función clave dentro de un sistema integrado de crecimiento."}
                        </p>
                      </div>
                    `
                  )}
                </div>
              </div>
            </div>
          </div>
        </${Section}>

        <${Section}
          id="system"
          eyebrow=${sectionIntro.system}
          title="Lo que proponemos no es una lista de servicios. Es un sistema regional de crecimiento."
          description="Esta es la nueva columna vertebral del trabajo: una operación que convierte aprendizajes previos en decisiones más inteligentes para Colombia y el clúster."
        >
          <div className="grid gap-5 lg:grid-cols-4">
            ${data.growth_engine.map(
              (item, index) => html`
                <div key=${item.title} className="glass-panel floating-card rounded-[30px] border border-white/10 p-6 shadow-2xl">
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Pilar 0${index + 1}</p>
                  <h3 className="mt-4 text-2xl font-semibold text-white">${item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-300">${item.body}</p>
                </div>
              `
            )}
          </div>

          <div className="mt-8 rounded-[32px] border border-white/10 bg-[#f2c230]/10 px-7 py-8 shadow-2xl">
            <p className="text-xs uppercase tracking-[0.32em] text-[#f2c230]">Lógica operativa</p>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <${CadenceCard} title="Semanal" body="Revisión de señales, decisiones tácticas y optimizaciones." />
              <${CadenceCard} title="Mensual" body="Prioridades por categoría, país y objetivo." />
              <${CadenceCard} title="Trimestral" body="Ajuste de roadmap regional según aprendizajes acumulados." />
              <${CadenceCard} title="Siempre activo" body="Narrativa ejecutiva única para performance, SEO, web y commerce." />
            </div>
          </div>
        </${Section}>

        <${Section}
          id="services"
          eyebrow=${sectionIntro.services}
          title="Estos son los servicios que sostienen la propuesta, pero organizados bajo una lógica de negocio."
          description="La idea no es vender piezas separadas. La idea es mostrar que tenemos la capacidad integral para sostener Colombia y ampliar el clúster con criterio."
        >
          <div className="grid gap-5 lg:grid-cols-4">
            ${data.service_model.map(
              (item) => html`
                <div key=${item.title} className="glass-panel floating-card rounded-[30px] border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-2xl font-semibold text-white">${item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-300">${item.body}</p>
                </div>
              `
            )}
          </div>
        </${Section}>

        <${Section}
          id="countries"
          eyebrow=${sectionIntro.countries}
          title="La continuidad en Colombia también habilita una expansión regional más inteligente."
          description="No todos los países deben ejecutarse igual. Por eso proponemos un sistema compartido con jugadas diferenciadas por mercado."
        >
          <div className="flex flex-wrap gap-3">
            ${data.countries.map(
              (country) => html`
                <button
                  key=${country.id}
                  className="country-pill rounded-full border px-4 py-3 text-sm font-semibold transition"
                  data-active=${country.id === activeCountry}
                  onClick=${() => setActiveCountry(country.id)}
                >
                  ${country.name}
                </button>
              `
            )}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="glass-panel rounded-[32px] border border-white/10 p-7 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">${currentCountry.status}</p>
                  <h3 className="mt-3 text-4xl font-semibold text-white">${currentCountry.name}</h3>
                </div>
                <span className="rounded-full bg-[#f2c230] px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black">
                  ${currentCountry.kpis.q2_focus}
                </span>
              </div>
              <p className="mt-6 text-xl font-semibold leading-9 text-white">${currentCountry.headline}</p>
              <p className="mt-4 text-sm leading-7 text-neutral-300">${currentCountry.north_star}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <${CountryMetric} label="Uplift estimado" value=${currency(currentCountry.kpis.target_revenue_uplift_mxn)} />
                <${CountryMetric} label="Meta SEO top 10" value=${percent(currentCountry.kpis.target_top10_share)} />
                <${CountryMetric} label="Mix de conversión" value=${percent(currentCountry.kpis.target_paid_mix_conversion)} />
              </div>
            </div>

            <div className="grid gap-5">
              <${ListPanel} title="Categorías prioritarias" items=${currentCountry.priority_sectors} />
              <${ListPanel} title="Señales del mercado" items=${currentCountry.signals} />
              <${ListPanel} title="Jugadas estratégicas" items=${currentCountry.plays} />
            </div>
          </div>
        </${Section}>

        <${Section}
          id="advantage"
          eyebrow=${sectionIntro.advantage}
          title="Por qué somos la mejor agencia para continuar con Colombia."
          description="No por discurso. Por conocimiento acumulado, lectura regional, integración de servicios y capacidad para operar la siguiente etapa sin reiniciar el aprendizaje."
        >
          <div className="grid gap-5 lg:grid-cols-4">
            ${data.competitive_advantage.map(
              (item) => html`
                <div key=${item.title} className="glass-panel floating-card rounded-[30px] border border-white/10 p-6 shadow-2xl">
                  <h3 className="text-2xl font-semibold text-white">${item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-neutral-300">${item.body}</p>
                </div>
              `
            )}
          </div>
        </${Section}>

        <${Section}
          id="impact"
          eyebrow=${sectionIntro.impact}
          title="El resultado esperado es más claridad, más eficiencia y un mejor caso de negocio para seguir creciendo."
          description="La propuesta no se queda en narrativa. Busca un impacto medible y un marco más sólido para defender continuidad y expansión."
        >
          <div className="grid gap-4 md:grid-cols-3">
            ${data.impact.headline_metrics.map(
              (metric) => html`<${MetricCard} key=${metric.label} title=${metric.label} value=${metric.value} detail=${metric.detail} />`
            )}
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl md:p-8">
              <${ChartHeader}
                title="Escenario de continuidad vs. reinicio"
                body="La continuidad acelera impacto porque aprovecha aprendizaje previo. Empezar de cero retrasa la curva."
              />
              <${ChartWrap}>
                <${ResponsiveContainer} width="100%" height=${320}>
                  <${AreaChart} data=${data.impact.scenario}>
                    <defs>
                      <linearGradient id="baseFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor=${colors.gray} stopOpacity="0.55" />
                        <stop offset="95%" stopColor=${colors.gray} stopOpacity="0.02" />
                      </linearGradient>
                      <linearGradient id="continuidadFill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor=${colors.amber} stopOpacity="0.45" />
                        <stop offset="95%" stopColor=${colors.amber} stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    <${CartesianGrid} vertical=${false} />
                    <${XAxis} dataKey="phase" tick=${axisTick} tickLine=${false} axisLine=${false} />
                    <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false} tickFormatter=${(value) => `${value}M`} />
                    <${Tooltip} content=${ChartTooltip} />
                    <${Area} type="monotone" dataKey="base" name="Base" stroke=${colors.gray} fill="url(#baseFill)" strokeWidth=${3} />
                    <${Area}
                      type="monotone"
                      dataKey="continuidad"
                      name="Con continuidad"
                      stroke=${colors.amber}
                      fill="url(#continuidadFill)"
                      strokeWidth=${3}
                    />
                  </${AreaChart}>
                </${ResponsiveContainer}>
              </${ChartWrap}>
            </div>

            <div className="glass-panel rounded-[32px] border border-white/10 p-7 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Qué gana Midea si sigue con nosotros</p>
              <div className="mt-6 space-y-4">
                <${OutcomeCard}
                  title="Continuidad con criterio"
                  body="No se trata solo de seguir. Se trata de seguir con una hipótesis más fuerte y mejor estructurada."
                />
                <${OutcomeCard}
                  title="Una historia ejecutiva más sólida"
                  body="La cuenta deja de hablar solo de canales y empieza a hablar de crecimiento, madurez y expansión."
                />
                <${OutcomeCard}
                  title="Mayor capacidad regional"
                  body="Colombia se convierte en base de crecimiento y no en una operación aislada."
                />
              </div>
            </div>
          </div>
        </${Section}>

        <${Section}
          id="closing"
          eyebrow=${sectionIntro.closing}
          title=${data.closing_statement.title}
          description=${data.closing_statement.body}
        >
          <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
            <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-2xl md:p-10">
              <p className="font-serif text-4xl leading-tight text-white md:text-5xl">
                “Seguir con nosotros no significa conservar lo mismo. Significa acelerar la siguiente etapa con todo lo que ya aprendimos.”
              </p>
              <p className="mt-6 text-sm uppercase tracking-[0.32em] text-neutral-500">Propuesta para continuidad y expansión regional</p>
            </div>
            <div className="glass-panel rounded-[36px] border border-white/10 p-8 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Próximos pasos sugeridos</p>
              <div className="mt-5 space-y-3">
                ${data.next_steps.map(
                  (step, index) => html`
                    <div key=${step} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-neutral-300">
                      <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2c230] text-xs font-bold text-black">
                        ${index + 1}
                      </span>
                      ${step}
                    </div>
                  `
                )}
              </div>
            </div>
          </div>
        </${Section}>
      </main>
    </div>
  `;
}

const axisTick = { fill: "#8f8f8f", fontSize: 12 };

function Section({ id, eyebrow, title, subtitle, description, className = "", children }) {
  return html`
    <${motion.section}
      id=${id}
      data-section="true"
      className=${`section-shell px-4 py-20 md:px-8 md:py-24 ${className}`}
      initial=${{ opacity: 0, y: 24 }}
      whileInView=${{ opacity: 1, y: 0 }}
      viewport=${{ once: true, amount: 0.2 }}
      transition=${{ duration: 0.65, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">${eyebrow}</p>
        <div className="mt-4 max-w-5xl">
          <h2 className="text-4xl font-semibold leading-tight text-white md:text-6xl">${title}</h2>
          ${subtitle && html`<p className="mt-4 text-lg text-neutral-300">${subtitle}</p>`}
          ${description && html`<p className="mt-6 max-w-4xl text-base leading-8 text-neutral-300 md:text-lg">${description}</p>`}
        </div>
        <div className="mt-10">${children}</div>
      </div>
    </${motion.section}>
  `;
}

function MetricCard({ title, value, detail }) {
  return html`
    <div className="metric-card glass-panel rounded-[28px] border border-white/10 p-6 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">${title}</p>
      <p className="mt-4 text-4xl font-semibold text-white">${value}</p>
      <p className="mt-4 text-sm leading-7 text-neutral-300">${detail}</p>
    </div>
  `;
}

function Badge({ text, tone }) {
  const styles = {
    amber: "border-[#f2c230] bg-[#f2c230] text-black",
    dark: "border-white/10 bg-white/5 text-white",
    gray: "border-white/10 bg-neutral-800 text-neutral-200"
  };

  return html`
    <span className=${`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] ${styles[tone]}`}>
      ${text}
    </span>
  `;
}

function DecisionRow({ title, body }) {
  return html`
    <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-4">
      <p className="text-sm font-semibold text-white">${title}</p>
      <p className="mt-2 text-sm leading-7 text-neutral-300">${body}</p>
    </div>
  `;
}

function InsightPanel({ index, title, body }) {
  return html`
    <div className="glass-panel rounded-[30px] border border-white/10 p-7 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">0${index}</p>
      <h3 className="mt-4 text-3xl font-semibold leading-tight text-white">${title}</h3>
      <p className="mt-4 text-sm leading-8 text-neutral-300">${body}</p>
    </div>
  `;
}

function ModelColumn({ title, items, tone }) {
  const style =
    tone === "amber"
      ? "border-[#f2c230]/30 bg-[#f2c230]/10 text-white"
      : "border-white/10 bg-white/5 text-white";

  const accent = tone === "amber" ? "text-[#f2c230]" : "text-neutral-500";

  return html`
    <div className=${`rounded-[28px] border p-6 ${style}`}>
      <p className=${`text-xs uppercase tracking-[0.3em] ${accent}`}>${title}</p>
      <div className="mt-5 space-y-3">
        ${items.map(
          (item) => html`
            <div key=${item} className="rounded-[20px] border border-white/10 bg-black/20 px-4 py-4 text-sm font-medium text-neutral-200">
              ${item}
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function FilterPill({ label, active, onClick }) {
  return html`
    <button
      className=${`rounded-full border px-4 py-3 text-sm font-semibold transition ${
        active ? "border-[#f2c230] bg-[#f2c230] text-black" : "border-white/10 bg-white/5 text-neutral-300"
      }`}
      onClick=${onClick}
    >
      ${label}
    </button>
  `;
}

function ChartHeader({ title, body }) {
  return html`
    <div>
      <p className="text-sm font-semibold text-white">${title}</p>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-300">${body}</p>
    </div>
  `;
}

function ChartWrap({ children }) {
  return html`<div className="mt-6 rounded-[28px] border border-white/10 bg-black/20 p-4">${children}</div>`;
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  const formatValue = (entry) => {
    if (typeof entry.value !== "number") {
      return entry.value;
    }

    if (String(entry.dataKey).toLowerCase().includes("inversion") || String(entry.dataKey).toLowerCase().includes("ingres")) {
      return currency(entry.value);
    }

    return entry.value > 999 ? number(entry.value) : entry.value;
  };

  return html`
    <div className="tooltip-card min-w-[180px] px-4 py-3">
      ${label && html`<p className="text-xs uppercase tracking-[0.24em] text-neutral-500">${label}</p>`}
      <div className="mt-2 space-y-1">
        ${payload.map(
          (entry) => html`
            <div key=${entry.dataKey} className="flex items-center justify-between gap-4 text-sm">
              <span className="font-medium text-neutral-400">${entry.name}</span>
              <span className="font-semibold text-white">${formatValue(entry)}</span>
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function InsightSummary({ title, points }) {
  return html`
    <div className="glass-panel rounded-[32px] border border-white/10 p-6 shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">${title}</p>
      <div className="mt-5 space-y-3">
        ${points.map(
          (point) => html`
            <div key=${point} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-neutral-300">
              ${point}
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function SourceMixCard({ title, data }) {
  return html`
    <div className="glass-panel rounded-[30px] border border-white/10 p-6 shadow-2xl">
      <p className="text-sm font-semibold text-white">${title}</p>
      <div className="mt-5 grid gap-3">
        ${data.map(
          (item) => html`
            <div key=${item.source} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-white">${item.source}</p>
                <p className="text-sm font-semibold text-neutral-400">${percent(item.share_of_sessions, 0)}</p>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-[#f2c230]" style=${{ width: percent(item.share_of_sessions, 1) }}></div>
              </div>
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function MiniStat({ title, value, body, compact = false }) {
  return html`
    <div className="glass-panel rounded-[30px] border border-white/10 p-6 shadow-2xl">
      <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">${title}</p>
      <p className="mt-4 text-${compact ? "3xl" : "4xl"} font-semibold text-white">${value}</p>
      ${body ? html`<p className="mt-4 text-sm leading-7 text-neutral-300">${body}</p>` : null}
    </div>
  `;
}

function BenchmarkCard({ title, body, stat }) {
  return html`
    <div className="glass-panel rounded-[30px] border border-white/10 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-semibold text-white">${title}</h3>
        <span className="rounded-full bg-[#f2c230] px-3 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-black">
          ${stat}
        </span>
      </div>
      <p className="mt-4 text-sm leading-7 text-neutral-300">${body}</p>
    </div>
  `;
}

function CadenceCard({ title, body }) {
  return html`
    <div className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-sm font-semibold text-white">${title}</p>
      <p className="mt-2 text-sm leading-7 text-neutral-300">${body}</p>
    </div>
  `;
}

function CountryMetric({ label, value }) {
  return html`
    <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">${label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">${value}</p>
    </div>
  `;
}

function ListPanel({ title, items }) {
  return html`
    <div className="glass-panel rounded-[30px] border border-white/10 p-6 shadow-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">${title}</p>
      <div className="mt-5 space-y-3">
        ${items.map(
          (item) => html`
            <div key=${item} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-neutral-300">
              ${item}
            </div>
          `
        )}
      </div>
    </div>
  `;
}

function OutcomeCard({ title, body }) {
  return html`
    <div className="rounded-[24px] border border-white/10 bg-white/5 px-5 py-5">
      <p className="text-lg font-semibold text-white">${title}</p>
      <p className="mt-3 text-sm leading-7 text-neutral-300">${body}</p>
    </div>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
