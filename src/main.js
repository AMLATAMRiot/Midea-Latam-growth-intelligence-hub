import React, { useEffect, useMemo, useState, useRef } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import htm from "https://esm.sh/htm@3.1.1";
import { motion, useInView } from "https://esm.sh/framer-motion@11.11.9";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  Cell, ResponsiveContainer, Tooltip, XAxis, YAxis
} from "https://esm.sh/recharts@2.13.3";

const html = htm.bind(React.createElement);

const C = {
  amber: "#f2c230",
  amberDim: "rgba(242,194,48,0.14)",
  gray: "#525252",
  ink: "#f5f5f5",
  muted: "#a3a3a3",
  panel: "#171717",
  line: "rgba(255,255,255,0.09)"
};

const logos = {
  riot: "./src/assets/logos/riot-logo.png",
  midea: "./src/assets/logos/midea-logo.png"
};

const fmt = {
  usd: (v, compact = true) => {
    if (compact) {
      if (v >= 1000000) return `${(v/1000000).toFixed(1)}M USD`;
      if (v >= 1000)    return `${(v/1000).toFixed(1)}K USD`;
      return `${v.toFixed(2)} USD`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency", currency: "USD", maximumFractionDigits: 0
    }).format(v);
  },
  num: (v) => new Intl.NumberFormat("es-CO", {
    notation: v >= 10000 ? "compact" : "standard",
    maximumFractionDigits: 1
  }).format(v),
  pct: (v, d = 0) => `${(v * 100).toFixed(d)}%`
};

const axisTick = { fill: "#737373", fontSize: 11, fontFamily: "Manrope" };

/* ─── nav ─────────────────────────────────────────────────────────── */
const NAV = [
  { id: "hero",    label: "Inicio" },
  { id: "mexico",  label: "México" },
  { id: "colombia",label: "Colombia" },
  { id: "cluster", label: "Clúster" },
  { id: "funnel",  label: "Propuesta" },
  { id: "cierre",  label: "Siguiente paso" }
];

/* ─── App ─────────────────────────────────────────────────────────── */
function App() {
  const [d, setD] = useState(null);
  const [active, setActive] = useState("hero");
  const [clusterTab, setClusterTab] = useState("co");

  useEffect(() => {
    fetch("./src/data/mideaData.json?v=2")
      .then(r => r.json()).then(setD)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!d) return;
    const sections = Array.from(document.querySelectorAll("[data-section]"));
    const obs = new IntersectionObserver(entries => {
      const vis = entries.filter(e => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (vis?.target?.id) setActive(vis.target.id);
    }, { threshold: [0.2, 0.5] });
    sections.forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, [d]);

  if (!d) return html`
    <main class="min-h-screen flex items-center justify-center bg-[#090909]">
      <div class="glass-panel rounded-[28px] border border-white/10 px-10 py-12 shadow-2xl">
        <p class="text-xs uppercase tracking-[0.34em] text-neutral-500">Cargando</p>
        <h1 class="mt-4 font-serif text-4xl text-white">Un momento…</h1>
      </div>
    </main>
  `;

  const clusterCountry = d.countries.find(c => c.id === clusterTab);
  const paidData = d.paid_media_country.map(r => ({
    mercado: r.country, inversion: r.executed_budget_usd, ingresos: r.revenue_usd
  }));
  const seoData = d.seo_country.map(r => ({
    mercado: r.country, top10: Math.round(r.top10_share * 100)
  }));
  const mxObjectives = d.paid_media_objective.filter(r => r.country === "MX");
  const coSources = d.web_top_sources.filter(r => r.country === "CO");

  return html`
    <div class="app-shell relative min-h-screen bg-[#090909] text-white">

      <!-- HEADER -->
      <header class="fixed inset-x-0 top-0 z-40 px-4 py-4 md:px-8">
        <div class="mx-auto flex max-w-7xl items-center justify-between">
          <div class="glass-panel rounded-full border border-white/10 px-4 py-2.5 shadow-xl">
            <div class="flex items-center gap-3">
              <div class="h-9 flex items-center rounded-full bg-black px-3">
                <img src=${logos.riot} alt="RIOT" class="h-5 w-auto object-contain" />
              </div>
              <span class="text-[9px] uppercase tracking-[0.3em] text-neutral-600">×</span>
              <div class="h-9 flex items-center rounded-full bg-white px-3">
                <img src=${logos.midea} alt="Midea" class="h-5 w-auto object-contain" />
              </div>
            </div>
          </div>
          <nav class="hidden xl:flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-2 py-2 shadow-xl">
            ${NAV.map(item => html`
              <button key=${item.id}
                class=${`rounded-full px-4 py-2 text-xs font-semibold transition ${active === item.id ? "bg-[#f2c230] text-black" : "text-neutral-400 hover:text-white"}`}
                onClick=${() => document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" })}>
                ${item.label}
              </button>
            `)}
          </nav>
        </div>
      </header>

      <main class="relative z-10">

        <!-- ══════════════════════════════════════════════
             01  HERO
        ══════════════════════════════════════════════ -->
        <${Sec} id="hero" class="pt-32 md:pt-40">
          <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <!-- Main card -->
            <${motion.div}
              class="glass-panel rounded-[36px] border border-white/10 p-8 shadow-2xl md:p-10"
              initial=${{ opacity:0, y:28 }} whileInView=${{ opacity:1, y:0 }}
              viewport=${{ once:true }} transition=${{ duration:0.7 }}>
              <div class="flex items-center gap-3 mb-8">
                <div class="h-10 flex items-center rounded-full bg-black px-4">
                  <img src=${logos.riot} alt="RIOT" class="h-6 w-auto" />
                </div>
                <span class="text-[10px] uppercase tracking-[0.28em] text-neutral-500">para</span>
                <div class="h-10 flex items-center rounded-full bg-white px-4">
                  <img src=${logos.midea} alt="Midea" class="h-6 w-auto" />
                </div>
              </div>
              <p class="text-xs uppercase tracking-[0.32em] text-[#f2c230]">Propuesta estratégica · Q2 2026</p>
              <h1 class="mt-4 font-serif text-5xl leading-[1.1] text-white md:text-7xl">
                Lo que construimos.<br/>Lo que viene.
              </h1>
              <p class="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
                En México demostramos que el modelo funciona. En Colombia sentamos las bases. Ahora proponemos un funnel completo para el nuevo clúster regional.
              </p>
              <div class="mt-8 flex flex-wrap gap-3">
                <${Chip} text="México: ROAS 20.7×" tone="amber" />
                <${Chip} text="Colombia Q1 activo" tone="dark" />
                <${Chip} text="Clúster CO · EC · VE" tone="dark" />
              </div>
            </${motion.div}>

            <!-- KPIs -->
            <div class="grid gap-4 content-start">
              ${d.hero_kpis.map((k, i) => html`
                <${motion.div} key=${k.label}
                  class="metric-card glass-panel rounded-[28px] border border-white/10 p-6 shadow-xl"
                  initial=${{ opacity:0, x:20 }} whileInView=${{ opacity:1, x:0 }}
                  viewport=${{ once:true }} transition=${{ duration:0.5, delay: i * 0.1 }}>
                  <p class="text-[10px] uppercase tracking-[0.3em] text-neutral-500">${k.label}</p>
                  <p class="mt-3 text-4xl font-semibold text-white">${k.value}</p>
                  <p class="mt-3 text-sm leading-6 text-neutral-400">${k.detail}</p>
                </${motion.div}>
              `)}
            </div>
          </div>
        </${Sec}>


        <!-- ══════════════════════════════════════════════
             02  MÉXICO — qué construimos
        ══════════════════════════════════════════════ -->
        <${Sec} id="mexico">
          <${SectionLabel} eyebrow="México · Benchmark regional" />
          <h2 class="mt-4 max-w-4xl font-serif text-5xl leading-tight text-white md:text-6xl">
            Un funnel completo que ya genera resultados.
          </h2>
          <p class="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            México no es solo una referencia. Es el playbook vivo que define lo que es posible para Midea en la región: awareness, consideración y conversión trabajando en sistema.
          </p>

          <!-- Funnel pillars MX -->
          <div class="mt-10 grid gap-4 md:grid-cols-3">
            ${mxObjectives.map(item => html`
              <${motion.div} key=${item.objective}
                class="floating-card glass-panel rounded-[28px] border border-white/10 p-7 shadow-xl"
                initial=${{ opacity:0, y:20 }} whileInView=${{ opacity:1, y:0 }}
                viewport=${{ once:true }} transition=${{ duration:0.5 }}>
                <p class="text-[10px] uppercase tracking-[0.32em] text-neutral-500">${item.objective}</p>
                <p class="mt-3 text-3xl font-semibold text-white">${fmt.usd(item.spend_usd)}</p>
                <p class="mt-1 text-sm text-neutral-500">invertidos en Q1</p>
                ${item.roas ? html`
                  <div class="mt-4 rounded-2xl bg-[#f2c230]/12 px-4 py-3">
                    <p class="text-sm font-semibold text-[#f2c230]">ROAS ${item.roas_label}</p>
                    <p class="text-xs text-neutral-400 mt-1">Cada peso regresa ${item.roas.toFixed(1)}× en ingresos</p>
                  </div>
                ` : html`
                  <p class="mt-4 text-sm leading-6 text-neutral-400">
                    ${item.objective === "Awareness"
                      ? `${fmt.num(item.results)} impresiones · CPM ${fmt.usd(item.cost_per_result_usd, false)}`
                      : `${fmt.num(item.results)} clicks · CPC ${fmt.usd(item.cost_per_result_usd, false)}`}
                  </p>
                `}
              </${motion.div}>
            `)}
          </div>

          <!-- Charts row -->
          <div class="mt-6 grid gap-6 lg:grid-cols-2">
            <!-- Ecommerce MX -->
            <div class="glass-panel rounded-[32px] border border-white/10 p-6 shadow-xl md:p-8">
              <p class="text-sm font-semibold text-white">E-commerce: ingresos por canal en México</p>
              <p class="mt-2 text-sm text-neutral-400">Tres canales maduros, ${fmt.usd(d.ecommerce_mx_channels.reduce((s,r)=>s+r.revenue_usd,0))} generados en Q1.</p>
              <div class="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
                <${ResponsiveContainer} width="100%" height=${240}>
                  <${BarChart} data=${d.ecommerce_mx_channels} layout="vertical" margin=${{ left:8, right:12 }}>
                    <${CartesianGrid} horizontal=${false} stroke=${C.line} />
                    <${XAxis} type="number" tick=${axisTick} tickLine=${false} axisLine=${false}
                      tickFormatter=${v => fmt.usd(v)} />
                    <${YAxis} type="category" dataKey="channel" width=${90} tick=${axisTick}
                      tickLine=${false} axisLine=${false} />
                    <${Tooltip} content=${ChartTip} />
                    <${Bar} dataKey="revenue_usd" name="Ingresos" radius=${[0,8,8,0]} fill=${C.amber} />
                  </${BarChart}>
                </${ResponsiveContainer}>
              </div>
            </div>

            <!-- SEO comparison -->
            <div class="glass-panel rounded-[32px] border border-white/10 p-6 shadow-xl md:p-8">
              <p class="text-sm font-semibold text-white">Madurez SEO por mercado</p>
              <p class="mt-2 text-sm text-neutral-400">México lidera con 93% de keywords en top 10. Colombia está en 37% — hay recorrido claro.</p>
              <div class="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
                <${ResponsiveContainer} width="100%" height=${240}>
                  <${BarChart} data=${seoData} barSize=${40}>
                    <${CartesianGrid} vertical=${false} stroke=${C.line} />
                    <${XAxis} dataKey="mercado" tick=${axisTick} tickLine=${false} axisLine=${false} />
                    <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false}
                      tickFormatter=${v => `${v}%`} />
                    <${Tooltip} content=${ChartTip} />
                    <${Bar} dataKey="top10" name="Top 10 %" radius=${[8,8,0,0]}>
                      ${seoData.map((e,i) => html`
                        <${Cell} key=${e.mercado} fill=${e.mercado === "MX" ? C.amber : C.gray} />
                      `)}
                    </${Bar}>
                  </${BarChart}>
                </${ResponsiveContainer}>
              </div>
            </div>
          </div>

          <!-- Callout -->
          <div class="mt-6 rounded-[28px] border border-[#f2c230]/20 bg-[#f2c230]/08 px-7 py-6">
            <p class="text-xs uppercase tracking-[0.32em] text-[#f2c230]">Lo que esto significa para el clúster</p>
            <p class="mt-3 text-xl font-semibold text-white leading-snug">
              Un modelo con awareness, consideración y conversión integrados ya está validado dentro de Midea. No hay que inventarlo — hay que trasladarlo.
            </p>
          </div>
        </${Sec}>


        <!-- ══════════════════════════════════════════════
             03  COLOMBIA — lo que ya hicimos
        ══════════════════════════════════════════════ -->
        <${Sec} id="colombia">
          <${SectionLabel} eyebrow="Colombia · Q1 2026" />
          <h2 class="mt-4 max-w-4xl font-serif text-5xl leading-tight text-white md:text-6xl">
            Las bases ya están puestas.
          </h2>
          <p class="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            En Q1 operamos Colombia solo con redes sociales y sin presupuesto propio. Aun así los datos muestran señales claras de demanda. Con un funnel estructurado, el potencial es mucho mayor.
          </p>

          <!-- Stats CO Q1 -->
          <div class="mt-10 grid gap-4 md:grid-cols-4">
            ${[
              { label: "Sesiones web", value: fmt.num(11722), note: "60% via Paid Search" },
              { label: "Inversión paid Q1", value: fmt.usd(1652), note: "79% de ejecución presupuestal" },
              { label: "CPC consideración", value: "$0.007 USD", note: "Muy eficiente vs benchmark" },
              { label: "Keywords top 10 SEO", value: "37%", note: "vs 93% de México → gap accionable" }
            ].map((s, i) => html`
              <${motion.div} key=${s.label}
                class="metric-card glass-panel rounded-[28px] border border-white/10 p-6 shadow-xl"
                initial=${{ opacity:0, y:16 }} whileInView=${{ opacity:1, y:0 }}
                viewport=${{ once:true }} transition=${{ duration:0.45, delay: i*0.08 }}>
                <p class="text-[10px] uppercase tracking-[0.3em] text-neutral-500">${s.label}</p>
                <p class="mt-3 text-3xl font-semibold text-white">${s.value}</p>
                <p class="mt-2 text-xs leading-5 text-neutral-400">${s.note}</p>
              </${motion.div}>
            `)}
          </div>

          <div class="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <!-- Traffic mix -->
            <div class="glass-panel rounded-[32px] border border-white/10 p-7 shadow-xl">
              <p class="text-sm font-semibold text-white">De dónde viene el tráfico</p>
              <p class="mt-2 text-sm text-neutral-400">Colombia ya tiene intención de búsqueda capturada. El siguiente paso es convertirla.</p>
              <div class="mt-6 grid gap-3">
                ${coSources.map(s => html`
                  <div key=${s.source} class="rounded-[18px] border border-white/10 bg-white/5 px-5 py-4">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-semibold text-white">${s.source}</p>
                      <p class="text-sm font-semibold text-[#f2c230]">${fmt.pct(s.share_of_sessions)}</p>
                    </div>
                    <div class="mt-3 h-1.5 rounded-full bg-white/10">
                      <div class="h-1.5 rounded-full bg-[#f2c230]"
                        style=${{ width: `${(s.share_of_sessions * 100).toFixed(1)}%` }}></div>
                    </div>
                  </div>
                `)}
              </div>
            </div>

            <!-- Pain → Oportunidad -->
            <div class="glass-panel rounded-[32px] border border-white/10 p-7 shadow-xl">
              <p class="text-sm font-semibold uppercase tracking-[0.28em] text-neutral-500">Dónde está la oportunidad</p>
              <div class="mt-5 space-y-4">
                ${d.pain_points.map(p => html`
                  <div key=${p.title} class="rounded-[22px] border border-white/10 bg-white/5 px-5 py-5">
                    <p class="text-sm font-semibold text-white">${p.title}</p>
                    <p class="mt-2 text-sm leading-6 text-neutral-400">${p.detail}</p>
                    <p class="mt-3 rounded-xl bg-[#f2c230]/10 px-4 py-2.5 text-xs font-semibold text-[#f2c230]">→ ${p.impact}</p>
                  </div>
                `)}
              </div>
            </div>
          </div>
        </${Sec}>


        <!-- ══════════════════════════════════════════════
             04  CLÚSTER CO · EC · VE
        ══════════════════════════════════════════════ -->
        <${Sec} id="cluster">
          <${SectionLabel} eyebrow="Clúster regional · Nueva cuenta" />
          <h2 class="mt-4 max-w-4xl font-serif text-5xl leading-tight text-white md:text-6xl">
            Colombia, Ecuador y Venezuela como sistema.
          </h2>
          <p class="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            La reestructura es una oportunidad, no un riesgo. Tres mercados distintos con un playbook compartido generan más eficiencia que tres operaciones aisladas.
          </p>

          <!-- Country tabs -->
          <div class="mt-10 flex flex-wrap gap-3">
            ${d.countries.map(c => html`
              <button key=${c.id}
                class="country-pill rounded-full border px-5 py-2.5 text-sm font-semibold transition"
                data-active=${c.id === clusterTab}
                onClick=${() => setClusterTab(c.id)}>
                ${c.name}
              </button>
            `)}
          </div>

          ${clusterCountry && html`
            <${motion.div}
              key=${clusterTab}
              class="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]"
              initial=${{ opacity:0 }} animate=${{ opacity:1 }} transition=${{ duration:0.3 }}>
              <div class="glass-panel rounded-[32px] border border-white/10 p-7 shadow-xl">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-[10px] uppercase tracking-[0.3em] text-neutral-500">${clusterCountry.status}</p>
                    <h3 class="mt-2 text-4xl font-semibold text-white">${clusterCountry.name}</h3>
                  </div>
                  <span class="rounded-full bg-[#f2c230] px-3 py-1.5 text-xs font-semibold text-black">
                    ${clusterCountry.kpis.q2_focus}
                  </span>
                </div>
                <p class="mt-5 text-lg font-semibold leading-8 text-white">${clusterCountry.headline}</p>
                <p class="mt-3 text-sm leading-7 text-neutral-400">${clusterCountry.north_star}</p>
                <div class="mt-7 grid gap-3 sm:grid-cols-3">
                  ${[
                    { label: "Uplift estimado", value: fmt.usd(clusterCountry.kpis.target_revenue_uplift_usd) },
                    { label: "Meta SEO top 10", value: fmt.pct(clusterCountry.kpis.target_top10_share) },
                    { label: "Mix conversión", value: fmt.pct(clusterCountry.kpis.target_paid_mix_conversion) }
                  ].map(m => html`
                    <div key=${m.label} class="rounded-[18px] border border-white/10 bg-white/5 px-4 py-4">
                      <p class="text-[10px] uppercase tracking-[0.28em] text-neutral-500">${m.label}</p>
                      <p class="mt-2 text-2xl font-semibold text-white">${m.value}</p>
                    </div>
                  `)}
                </div>
              </div>

              <div class="space-y-4">
                ${[
                  { title: "Categorías prioritarias", items: clusterCountry.priority_sectors },
                  { title: "Señales del mercado", items: clusterCountry.signals },
                  { title: "Jugadas propuestas", items: clusterCountry.plays }
                ].map(panel => html`
                  <div key=${panel.title} class="glass-panel rounded-[28px] border border-white/10 p-5 shadow-xl">
                    <p class="text-[10px] uppercase tracking-[0.28em] text-neutral-500">${panel.title}</p>
                    <div class="mt-4 space-y-2">
                      ${panel.items.map(item => html`
                        <div key=${item} class="rounded-[16px] border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-neutral-300">
                          ${item}
                        </div>
                      `)}
                    </div>
                  </div>
                `)}
              </div>
            </${motion.div}>
          `}

          <!-- Total cluster opportunity -->
          <div class="mt-8 grid gap-4 md:grid-cols-3">
            ${d.countries.map((c, i) => html`
              <${motion.div} key=${c.id}
                class="rounded-[24px] border border-white/10 bg-white/5 p-5"
                initial=${{ opacity:0, y:12 }} whileInView=${{ opacity:1, y:0 }}
                viewport=${{ once:true }} transition=${{ delay: i*0.1 }}>
                <p class="text-xs font-semibold text-neutral-500">${c.name}</p>
                <p class="mt-2 text-3xl font-semibold text-white">${fmt.usd(c.kpis.target_revenue_uplift_usd)}</p>
                <p class="mt-1 text-xs text-neutral-500">potencial Q2–Q3</p>
              </${motion.div}>
            `)}
          </div>
        </${Sec}>


        <!-- ══════════════════════════════════════════════
             05  FUNNEL COMPLETO — propuesta
        ══════════════════════════════════════════════ -->
        <${Sec} id="funnel">
          <${SectionLabel} eyebrow="Propuesta · Funnel 360°" />
          <h2 class="mt-4 max-w-4xl font-serif text-5xl leading-tight text-white md:text-6xl">
            Lo que podemos construir juntos.
          </h2>
          <p class="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            No servicios sueltos. Un sistema donde cada capa alimenta la siguiente: de la visibilidad al click, del click a la consideración, de la consideración a la venta.
          </p>

          <!-- Funnel visual -->
          <div class="mt-10 grid gap-4 lg:grid-cols-4">
            ${[
              {
                stage: "01 · Awareness",
                title: "Hacer que Midea sea reconocida",
                items: ["Contenido en redes sociales", "Video en Meta y YouTube", "Influencer marketing"],
                note: "México: 6M impresiones Q1 con $3.1K USD"
              },
              {
                stage: "02 · Consideración",
                title: "Capturar la intención",
                items: ["Paid Search (Google)", "SEO & contenido orgánico", "Landing pages optimizadas"],
                note: "Colombia ya tiene CPC $0.12 — muy eficiente"
              },
              {
                stage: "03 · Conversión",
                title: "Cerrar la venta",
                items: ["Campañas de conversión directa", "Optimización de e-commerce", "Retargeting dinámico"],
                note: "México logra ROAS 20.7× en conversión"
              },
              {
                stage: "04 · Fidelización",
                title: "Mantener y escalar",
                items: ["Reporting ejecutivo mensual", "Playbook regional compartido", "Testing y optimización continua"],
                note: "Un sistema que aprende y mejora cada ciclo"
              }
            ].map((f, i) => html`
              <${motion.div} key=${f.stage}
                class="floating-card glass-panel rounded-[28px] border border-white/10 p-6 shadow-xl relative overflow-hidden"
                initial=${{ opacity:0, y:24 }} whileInView=${{ opacity:1, y:0 }}
                viewport=${{ once:true }} transition=${{ duration:0.5, delay: i*0.1 }}>
                <p class="text-[10px] uppercase tracking-[0.32em] text-[#f2c230]">${f.stage}</p>
                <h3 class="mt-3 text-lg font-semibold leading-snug text-white">${f.title}</h3>
                <div class="mt-5 space-y-2">
                  ${f.items.map(item => html`
                    <div key=${item} class="rounded-[14px] border border-white/10 bg-black/20 px-3 py-2.5 text-xs text-neutral-300">
                      ${item}
                    </div>
                  `)}
                </div>
                <p class="mt-5 text-xs leading-5 text-neutral-500 border-t border-white/10 pt-4">${f.note}</p>
              </${motion.div}>
            `)}
          </div>

          <!-- Paid media comparison — the main chart -->
          <div class="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div class="glass-panel rounded-[32px] border border-white/10 p-7 shadow-xl md:p-8">
              <p class="text-sm font-semibold text-white">Inversión vs ingresos por mercado · Q1 2026</p>
              <p class="mt-2 text-sm text-neutral-400">México ya cierra el loop. Colombia y Perú aún no tienen capa de conversión activa.</p>
              <div class="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
                <${ResponsiveContainer} width="100%" height=${280}>
                  <${BarChart} data=${paidData} barGap=${10}>
                    <${CartesianGrid} vertical=${false} stroke=${C.line} />
                    <${XAxis} dataKey="mercado" tick=${axisTick} tickLine=${false} axisLine=${false} />
                    <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false}
                      tickFormatter=${v => fmt.usd(v)} width=${90} />
                    <${Tooltip} content=${ChartTip} />
                    <${Bar} dataKey="inversion" name="Inversión" radius=${[6,6,0,0]} fill=${C.gray} />
                    <${Bar} dataKey="ingresos" name="Ingresos" radius=${[6,6,0,0]} fill=${C.amber} />
                  </${BarChart}>
                </${ResponsiveContainer}>
              </div>
              <!-- legend -->
              <div class="mt-4 flex gap-5 text-xs text-neutral-500">
                <span class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-sm" style=${{ background: C.gray }}></span>Inversión
                </span>
                <span class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-sm" style=${{ background: C.amber }}></span>Ingresos
                </span>
              </div>
            </div>

            <!-- Scenario projection -->
            <div class="glass-panel rounded-[32px] border border-white/10 p-7 shadow-xl">
              <p class="text-sm font-semibold text-white">Proyección del clúster</p>
              <p class="mt-2 text-sm text-neutral-400">Con funnel completo vs operación fragmentada.</p>
              <div class="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
                <${ResponsiveContainer} width="100%" height=${240}>
                  <${AreaChart} data=${d.impact.scenario}>
                    <defs>
                      <linearGradient id="aFull" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor=${C.amber} stopOpacity="0.4" />
                        <stop offset="95%" stopColor=${C.amber} stopOpacity="0.01" />
                      </linearGradient>
                      <linearGradient id="aBase" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="5%" stopColor=${C.gray} stopOpacity="0.4" />
                        <stop offset="95%" stopColor=${C.gray} stopOpacity="0.01" />
                      </linearGradient>
                    </defs>
                    <${CartesianGrid} vertical=${false} stroke=${C.line} />
                    <${XAxis} dataKey="phase" tick=${axisTick} tickLine=${false} axisLine=${false} />
                    <${YAxis} tick=${axisTick} tickLine=${false} axisLine=${false}
                      tickFormatter=${v => `$${v}M`} />
                    <${Tooltip} content=${ChartTip} />
                    <${Area} type="monotone" dataKey="base" name="Sin estructura"
                      stroke=${C.gray} fill="url(#aBase)" strokeWidth=${2} />
                    <${Area} type="monotone" dataKey="continuidad" name="Con funnel completo"
                      stroke=${C.amber} fill="url(#aFull)" strokeWidth=${2.5} />
                  </${AreaChart}>
                </${ResponsiveContainer}>
              </div>
              <div class="mt-5 rounded-[18px] bg-[#f2c230]/10 px-4 py-4">
                <p class="text-xs uppercase tracking-[0.28em] text-[#f2c230]">Potencial total clúster</p>
                <p class="mt-1 text-3xl font-semibold text-white">~$359K USD</p>
                <p class="text-xs text-neutral-400 mt-1">a 12 meses · escenario modelado · 1 USD = 17.26 MXN</p>
              </div>
            </div>
          </div>

          <!-- Growth engine pillars -->
          <div class="mt-8 grid gap-4 md:grid-cols-4">
            ${d.growth_engine.map((g, i) => html`
              <div key=${g.title} class="rounded-[22px] border border-white/10 bg-white/5 p-5">
                <p class="text-[10px] uppercase tracking-[0.28em] text-[#f2c230]">Pilar 0${i+1}</p>
                <p class="mt-3 text-base font-semibold text-white">${g.title}</p>
                <p class="mt-2 text-xs leading-5 text-neutral-400">${g.body}</p>
              </div>
            `)}
          </div>
        </${Sec}>


        <!-- ══════════════════════════════════════════════
             06  CIERRE
        ══════════════════════════════════════════════ -->
        <${Sec} id="cierre">
          <${SectionLabel} eyebrow="Siguiente paso" />
          <h2 class="mt-4 max-w-4xl font-serif text-5xl leading-tight text-white md:text-6xl">
            El momento de arrancar es ahora.
          </h2>
          <p class="mt-6 max-w-3xl text-base leading-8 text-neutral-300">
            México ya funciona. Colombia ya tiene señales. El clúster ya tiene una propuesta clara. Solo falta tomar la decisión.
          </p>

          <div class="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <!-- Quote / Statement -->
            <div class="glass-panel rounded-[36px] border border-white/10 p-10 shadow-2xl flex flex-col justify-between">
              <p class="font-serif text-4xl leading-tight text-white md:text-5xl">
                "No empezamos de cero. Empezamos desde lo que ya aprendimos."
              </p>
              <div class="mt-10 flex items-center gap-4">
                <div class="h-10 flex items-center rounded-full bg-black px-4">
                  <img src=${logos.riot} alt="RIOT" class="h-5 w-auto" />
                </div>
                <p class="text-xs uppercase tracking-[0.28em] text-neutral-500">para Midea LATAM · 2026</p>
              </div>
            </div>

            <!-- Next steps -->
            <div class="glass-panel rounded-[36px] border border-white/10 p-8 shadow-2xl">
              <p class="text-sm font-semibold uppercase tracking-[0.3em] text-neutral-500">Próximos pasos</p>
              <div class="mt-6 space-y-3">
                ${d.next_steps.map((step, i) => html`
                  <div key=${step} class="flex items-start gap-4 rounded-[20px] border border-white/10 bg-white/5 px-5 py-4">
                    <span class="flex-shrink-0 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f2c230] text-xs font-bold text-black">
                      ${i+1}
                    </span>
                    <p class="text-sm leading-6 text-neutral-300">${step}</p>
                  </div>
                `)}
              </div>

              <!-- CTA -->
              <div class="mt-6 rounded-[24px] border border-[#f2c230]/25 bg-[#f2c230]/10 px-6 py-6">
                <p class="text-sm font-semibold text-[#f2c230]">¿Abrimos la conversación?</p>
                <p class="mt-2 text-sm text-neutral-400 leading-6">
                  Podemos tener una propuesta económica y plan de arranque lista en menos de una semana.
                </p>
              </div>
            </div>
          </div>
        </${Sec}>
      </main>

      <!-- Footer -->
      <footer class="border-t border-white/10 px-4 py-8 text-center md:px-8">
        <p class="text-xs text-neutral-600">RIOT para Midea LATAM · Propuesta estratégica Q2 2026 · Datos Q1 actualizados ${d.meta.updated_at}</p>
      </footer>
    </div>
  `;
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function Sec({ id, class: cls = "", children }) {
  return html`
    <${motion.section}
      id=${id}
      data-section="true"
      class=${`section-shell px-4 py-20 md:px-8 md:py-28 ${cls}`}
      initial=${{ opacity:0, y:20 }}
      whileInView=${{ opacity:1, y:0 }}
      viewport=${{ once:true, amount:0.1 }}
      transition=${{ duration:0.65, ease:"easeOut" }}>
      <div class="mx-auto max-w-7xl">${children}</div>
    </${motion.section}>
  `;
}

function SectionLabel({ eyebrow }) {
  return html`<p class="text-xs uppercase tracking-[0.32em] text-neutral-500">${eyebrow}</p>`;
}

function Chip({ text, tone }) {
  const s = tone === "amber"
    ? "border-[#f2c230] bg-[#f2c230] text-black"
    : "border-white/10 bg-white/5 text-neutral-300";
  return html`
    <span class=${`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${s}`}>
      ${text}
    </span>
  `;
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const fmt2 = (entry) => {
    if (typeof entry.value !== "number") return entry.value;
    const k = String(entry.dataKey).toLowerCase();
    if (k.includes("inversion") || k.includes("ingres") || k.includes("revenue") || k.includes("usd")) return fmt.usd(entry.value, false);
    if (k.includes("top10")) return `${entry.value}%`;
    return entry.value > 999 ? fmt.num(entry.value) : entry.value;
  };
  return html`
    <div class="tooltip-card min-w-[170px] px-4 py-3">
      ${label && html`<p class="text-[10px] uppercase tracking-[0.24em] text-neutral-500 mb-2">${label}</p>`}
      <div class="space-y-1">
        ${payload.map(e => html`
          <div key=${e.dataKey} class="flex items-center justify-between gap-4 text-sm">
            <span class="text-neutral-400">${e.name}</span>
            <span class="font-semibold text-white">${fmt2(e)}</span>
          </div>
        `)}
      </div>
    </div>
  `;
}

createRoot(document.getElementById("root")).render(html`<${App} />`);
