import { useState, useRef, useEffect, useCallback } from "react";

/* ── FONTS & CSS ─────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Syne+Mono&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');`;

const CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0a0f1e;--ink2:#1e2740;--ink3:#3d4f7c;
  --sky:#e8f0fe;--sky2:#c7d9fd;--sky3:#f0f5ff;
  --blue:#2563eb;--blue-l:#3b82f6;--blue-xl:#dbeafe;
  --teal:#0d9488;--teal-l:#14b8a6;--teal-xl:#ccfbf1;
  --amber:#d97706;--amber-xl:#fef3c7;
  --red:#dc2626;--red-xl:#fee2e2;
  --green:#16a34a;--green-xl:#dcfce7;
  --white:#ffffff;--off:#f8faff;--off2:#f0f4ff;
  --border:#e2e8f0;--border2:#c7d2e7;
  --ff:'Plus Jakarta Sans',sans-serif;
  --fd:'Syne',sans-serif;
  --fm:'Syne Mono',monospace;
  --sh:0 1px 3px rgba(10,15,30,.06),0 4px 16px rgba(10,15,30,.08);
  --sh-lg:0 8px 32px rgba(10,15,30,.14);
}
html,body{min-height:100vh;background:var(--off);color:var(--ink);font-family:var(--ff)}

/* scrollbar */
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--off2)}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

/* animations */
@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes typeIn{from{width:0}to{width:100%}}
@keyframes dotBlink{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
@keyframes grow{from{transform:scaleY(0)}to{transform:scaleY(1)}}

.fu{animation:fadeUp .4s ease both}
.fi{animation:fadeIn .3s ease both}
.si{animation:slideIn .3s ease both}

/* SHELL */
.shell{display:grid;grid-template-columns:260px 1fr;grid-template-rows:64px 1fr;min-height:100vh}

/* TOPBAR */
.topbar{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;
  padding:0 28px;background:var(--ink);position:sticky;top:0;z-index:200}
.brand{display:flex;align-items:center;gap:12px}
.brand-hex{width:36px;height:36px;background:linear-gradient(135deg,var(--blue),var(--teal));
  clip-path:polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%);
  display:flex;align-items:center;justify-content:center;flex-shrink:0}
.brand-name{font-family:var(--fd);font-size:18px;font-weight:800;color:var(--white);letter-spacing:-.01em}
.brand-tag{font-size:10px;color:rgba(255,255,255,.4);font-family:var(--fm);margin-left:2px}
.topbar-r{display:flex;align-items:center;gap:10px}
.model-badge{display:flex;align-items:center;gap:6px;padding:5px 12px;
  background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
  border-radius:20px;font-size:11px;color:rgba(255,255,255,.7);font-family:var(--fm)}
.model-dot{width:6px;height:6px;border-radius:50%;background:var(--teal-l);
  animation:pulse 2s infinite}
.status-bar{display:flex;align-items:center;gap:6px;font-size:11px;
  color:rgba(255,255,255,.5);padding:5px 12px;
  border:1px solid rgba(255,255,255,.08);border-radius:20px}

/* SIDEBAR */
.sidebar{background:var(--white);border-right:1px solid var(--border);
  padding:20px 0;display:flex;flex-direction:column;
  position:sticky;top:64px;height:calc(100vh - 64px);overflow-y:auto}
.nav-sec{padding:14px 20px 5px;font-size:9.5px;font-weight:700;letter-spacing:.1em;
  text-transform:uppercase;color:var(--border2)}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;
  cursor:pointer;font-size:12.5px;color:var(--ink3);transition:all .15s;
  border-left:3px solid transparent;font-family:var(--ff);font-weight:400}
.nav-item:hover{background:var(--off);color:var(--ink2)}
.nav-item.on{background:var(--sky);color:var(--blue);
  border-left-color:var(--blue);font-weight:600}
.nav-ico{font-size:16px;width:20px;text-align:center;flex-shrink:0}
.nav-count{margin-left:auto;background:var(--blue);color:#fff;
  font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px}
.nav-foot{margin-top:auto;padding:16px 20px;border-top:1px solid var(--border)}
.nav-hint{font-size:10px;color:var(--border2);font-family:var(--fm);line-height:1.6}

/* MAIN */
.main{background:var(--off);padding:28px 32px;overflow-y:auto;height:calc(100vh - 64px)}

/* PAGE HEADER */
.ph{margin-bottom:24px}
.ph-title{font-family:var(--fd);font-size:28px;font-weight:800;color:var(--ink);
  letter-spacing:-.02em;line-height:1.1}
.ph-sub{font-size:12px;color:var(--ink3);margin-top:4px;font-weight:400}
.ph-actions{display:flex;gap:9px;margin-top:14px;flex-wrap:wrap}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:7px;font-family:var(--ff);
  font-size:12px;font-weight:600;border:none;cursor:pointer;
  border-radius:7px;padding:9px 18px;transition:all .15s;letter-spacing:.01em}
.btn-blue{background:var(--blue);color:#fff}
.btn-blue:hover{background:var(--blue-l);transform:translateY(-1px);box-shadow:0 4px 14px rgba(37,99,235,.35)}
.btn-ghost{background:transparent;color:var(--ink3);border:1px solid var(--border)}
.btn-ghost:hover{border-color:var(--border2);color:var(--ink2);background:var(--white)}
.btn-teal{background:var(--teal);color:#fff}
.btn-teal:hover{background:var(--teal-l);transform:translateY(-1px)}
.btn-ink{background:var(--ink);color:#fff}
.btn-ink:hover{background:var(--ink2);transform:translateY(-1px)}
.btn:disabled{opacity:.4;cursor:not-allowed;transform:none !important;box-shadow:none !important}
.btn-sm{padding:6px 13px;font-size:11px}
.btn-xs{padding:4px 9px;font-size:10.5px;border-radius:5px}

/* CARDS */
.card{background:var(--white);border:1px solid var(--border);border-radius:12px;
  padding:22px;box-shadow:var(--sh)}
.card-title{font-size:11px;font-weight:700;color:var(--ink3);
  letter-spacing:.07em;text-transform:uppercase;margin-bottom:14px}

/* GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:20px}
.g3{display:grid;grid-template-columns:2fr 1fr;gap:18px;margin-bottom:20px}
.mb{margin-bottom:18px}

/* REPORT TYPE CARDS */
.rtype-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:24px}
.rtype{background:var(--white);border:2px solid var(--border);border-radius:12px;
  padding:18px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden}
.rtype:hover{border-color:var(--blue-l);transform:translateY(-2px);box-shadow:var(--sh)}
.rtype.on{border-color:var(--blue);background:var(--sky3)}
.rtype-ico{font-size:26px;margin-bottom:10px}
.rtype-name{font-family:var(--fd);font-size:14px;font-weight:700;
  color:var(--ink);margin-bottom:4px}
.rtype-desc{font-size:11px;color:var(--ink3);line-height:1.5}
.rtype-badge{position:absolute;top:10px;right:10px;background:var(--blue);
  color:#fff;font-size:9px;font-weight:700;padding:2px 7px;border-radius:10px}
.rtype-check{position:absolute;top:10px;right:10px;width:20px;height:20px;
  border-radius:50%;background:var(--blue);display:flex;align-items:center;
  justify-content:center;font-size:11px;color:#fff}

/* CONTEXT PANEL */
.ctx-panel{background:var(--white);border:1px solid var(--border);border-radius:12px;
  padding:20px;margin-bottom:20px;box-shadow:var(--sh)}
.ctx-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:14px}
.ctx-item{background:var(--off2);border:1px solid var(--border);border-radius:8px;padding:12px}
.ctx-lbl{font-size:10px;font-weight:700;color:var(--ink3);letter-spacing:.06em;
  text-transform:uppercase;margin-bottom:5px}
.ctx-val{font-family:var(--fd);font-size:22px;font-weight:700;color:var(--ink)}
.ctx-sub{font-size:10px;color:var(--ink3);margin-top:2px}

/* CHAT / AGENT INTERFACE */
.chat-wrap{display:flex;flex-direction:column;gap:0}
.msg{display:flex;gap:12px;padding:16px 0;border-bottom:1px solid var(--off2);
  animation:fadeUp .3s ease both}
.msg:last-child{border-bottom:none}
.msg-av{width:34px;height:34px;border-radius:9px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700}
.msg-av.user{background:var(--ink);color:var(--white);font-family:var(--fd);font-size:13px}
.msg-av.agent{background:linear-gradient(135deg,var(--blue),var(--teal));color:#fff;font-size:16px}
.msg-body{flex:1;min-width:0}
.msg-meta{display:flex;align-items:center;gap:8px;margin-bottom:6px}
.msg-who{font-size:12px;font-weight:700;color:var(--ink)}
.msg-time{font-size:10.5px;color:var(--ink3);font-family:var(--fm)}
.msg-tag{font-size:9.5px;font-weight:700;padding:1px 7px;border-radius:10px;
  background:var(--sky);color:var(--blue)}
.msg-text{font-size:13px;color:var(--ink2);line-height:1.7;white-space:pre-wrap}
.msg-text p{margin-bottom:10px}
.msg-text p:last-child{margin-bottom:0}
.msg-text h2{font-family:var(--fd);font-size:16px;font-weight:700;color:var(--ink);
  margin:16px 0 8px;padding-bottom:6px;border-bottom:2px solid var(--blue);
  letter-spacing:-.01em}
.msg-text h3{font-family:var(--fd);font-size:14px;font-weight:700;color:var(--ink2);
  margin:12px 0 6px}
.msg-text ul{margin:8px 0 8px 18px}
.msg-text ul li{margin-bottom:5px;font-size:13px;color:var(--ink2)}
.msg-text strong{font-weight:700;color:var(--ink)}
.msg-text .art22-ok{display:inline-flex;align-items:center;gap:5px;
  background:var(--green-xl);color:var(--green);padding:2px 9px;
  border-radius:12px;font-size:11.5px;font-weight:700;margin:2px}
.msg-text .art22-warn{display:inline-flex;align-items:center;gap:5px;
  background:var(--amber-xl);color:var(--amber);padding:2px 9px;
  border-radius:12px;font-size:11.5px;font-weight:700;margin:2px}
.msg-text .data-table{width:100%;border-collapse:collapse;margin:12px 0;
  font-size:11.5px;border-radius:8px;overflow:hidden}
.msg-text .data-table th{background:var(--ink);color:#fff;padding:7px 12px;
  text-align:left;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.msg-text .data-table td{padding:8px 12px;border-bottom:1px solid var(--off2);color:var(--ink2)}
.msg-text .data-table tr:nth-child(even) td{background:var(--off2)}
.msg-text .kpi-row{display:flex;gap:12px;flex-wrap:wrap;margin:10px 0}
.msg-text .kpi-chip{background:var(--sky);border:1px solid var(--sky2);
  border-radius:8px;padding:8px 14px;min-width:120px}
.msg-text .kpi-chip .k-lbl{font-size:9.5px;font-weight:700;color:var(--blue);
  letter-spacing:.06em;text-transform:uppercase;margin-bottom:3px}
.msg-text .kpi-chip .k-val{font-family:var(--fd);font-size:20px;font-weight:700;color:var(--ink)}
.msg-text .kpi-chip .k-sub{font-size:10px;color:var(--ink3)}

/* Thinking dots */
.thinking{display:flex;align-items:center;gap:5px;padding:4px 0}
.thinking span{width:7px;height:7px;border-radius:50%;background:var(--blue);
  animation:dotBlink 1.2s infinite}
.thinking span:nth-child(2){animation-delay:.2s}
.thinking span:nth-child(3){animation-delay:.4s}

/* INPUT BAR */
.input-bar{background:var(--white);border:1px solid var(--border);border-radius:12px;
  padding:14px 16px;box-shadow:var(--sh);margin-top:16px}
.input-row{display:flex;gap:10px;align-items:flex-end}
.input-field{flex:1;background:var(--off);border:1px solid var(--border);
  border-radius:8px;padding:10px 14px;font-family:var(--ff);font-size:13px;
  color:var(--ink);resize:none;outline:none;min-height:44px;max-height:140px;
  transition:border-color .15s;line-height:1.5}
.input-field:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(37,99,235,.1)}
.input-field::placeholder{color:var(--border2)}
.input-hints{display:flex;gap:7px;flex-wrap:wrap;margin-top:10px}
.hint-pill{background:var(--sky3);border:1px solid var(--sky2);color:var(--blue);
  font-size:10.5px;font-weight:500;padding:4px 11px;border-radius:20px;
  cursor:pointer;transition:all .15s}
.hint-pill:hover{background:var(--sky);border-color:var(--blue-l)}

/* REPORT OUTPUT */
.report-card{background:var(--white);border:1px solid var(--border);border-radius:12px;
  box-shadow:var(--sh-lg);overflow:hidden;margin-top:20px}
.report-hd{background:var(--ink);padding:20px 24px;display:flex;
  align-items:center;justify-content:space-between}
.report-hd-title{font-family:var(--fd);font-size:18px;font-weight:800;
  color:var(--white);letter-spacing:-.01em}
.report-hd-meta{font-size:11px;color:rgba(255,255,255,.45);font-family:var(--fm);margin-top:2px}
.report-body{padding:28px}
.report-section{margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--off2)}
.report-section:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0}
.report-sec-title{font-family:var(--fd);font-size:16px;font-weight:700;
  color:var(--ink);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.report-sec-title::before{content:'';width:4px;height:18px;
  background:linear-gradient(var(--blue),var(--teal));border-radius:2px;flex-shrink:0}

/* HISTORY SIDEBAR ITEMS */
.hist-item{padding:10px 20px;cursor:pointer;border-bottom:1px solid var(--off2);
  transition:background .15s}
.hist-item:hover{background:var(--off)}
.hist-type{font-size:10px;font-weight:700;color:var(--blue);text-transform:uppercase;
  letter-spacing:.06em;margin-bottom:2px}
.hist-name{font-size:12px;font-weight:600;color:var(--ink2)}
.hist-date{font-size:10px;color:var(--ink3);font-family:var(--fm)}

/* TAGS */
.tag{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;
  border-radius:4px;font-size:10px;font-weight:600;background:var(--off2);color:var(--ink3)}
.tag-blue{background:var(--sky);color:var(--blue)}
.tag-teal{background:var(--teal-xl);color:var(--teal)}
.tag-green{background:var(--green-xl);color:var(--green)}
.tag-red{background:var(--red-xl);color:var(--red)}

/* TOAST */
.toast{position:fixed;bottom:24px;right:24px;z-index:999;
  background:var(--ink);color:#fff;border-radius:10px;
  padding:12px 18px;font-size:12.5px;display:flex;align-items:center;gap:10px;
  animation:fadeUp .3s ease;box-shadow:var(--sh-lg);max-width:340px;
  border-left:3px solid var(--teal)}

/* PROGRESS */
.prog-bar{height:4px;background:var(--off2);border-radius:2px;overflow:hidden;margin:8px 0}
.prog-fill{height:100%;border-radius:2px;transition:width 1.2s ease;
  background:linear-gradient(90deg,var(--blue),var(--teal))}

/* BADGE */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;
  border-radius:20px;font-size:10.5px;font-weight:600}
.badge-ok{background:var(--green-xl);color:var(--green)}
.badge-warn{background:var(--amber-xl);color:var(--amber)}
.badge-err{background:var(--red-xl);color:var(--red)}

/* Copy button */
.copy-btn{background:transparent;border:1px solid var(--border);color:var(--ink3);
  border-radius:5px;padding:4px 9px;font-size:10.5px;cursor:pointer;
  transition:all .15s;font-family:var(--ff)}
.copy-btn:hover{background:var(--off);color:var(--ink)}
`;

/* ── DATA ─────────────────────────────────────────────────── */
const CENIA_DATA = {
  proyectos: [
    { id:"CENIA-001", nombre:"Capacitación IA PYMES", area:"Formación",    lead:"Ana Muñoz",    presupuesto:18000000, ejecutado:13200000, hitos:6, hitosOk:4, estado:"En Curso" },
    { id:"CENIA-002", nombre:"Observatorio IA Latam", area:"Investigación",lead:"Carlos Vera",  presupuesto:32000000, ejecutado:14800000, hitos:8, hitosOk:3, estado:"En Curso" },
    { id:"CENIA-003", nombre:"Red Investigadores",    area:"Ecosistema",   lead:"María Torres", presupuesto:12000000, ejecutado:10600000, hitos:5, hitosOk:5, estado:"Activo"   },
    { id:"CENIA-004", nombre:"Datos Abiertos",        area:"Datos",        lead:"Diego Ramos",  presupuesto:25000000, ejecutado:2500000,  hitos:7, hitosOk:0, estado:"Pendiente"},
    { id:"CENIA-005", nombre:"IA en Salud Pública",   area:"Aplicaciones", lead:"Sofía Lagos",  presupuesto:42000000, ejecutado:25400000, hitos:9, hitosOk:5, estado:"En Revisión"},
    { id:"CENIA-006", nombre:"Formación Docentes",    area:"Formación",    lead:"Luis Pérez",   presupuesto:9000000,  ejecutado:450000,   hitos:4, hitosOk:0, estado:"Pendiente"},
  ],
  contratos: [
    { id:"CONT-001", proyecto:"CENIA-001", proveedor:"Ana Muñoz Díaz",          tipo:"Natural",  monto:3200000,  estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-002", proyecto:"CENIA-001", proveedor:"Inmobiliaria El Centro",  tipo:"Jurídica", monto:480000,   estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-003", proyecto:"CENIA-002", proveedor:"Amazon Web Services",     tipo:"Jurídica", monto:2400000,  estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-004", proyecto:"CENIA-002", proveedor:"Dra. María Torres",       tipo:"Natural",  monto:4800000,  estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-005", proyecto:"CENIA-005", proveedor:"TechMed Chile SpA",       tipo:"Jurídica", monto:8500000,  estado:"Finalizado",art22:"Cumple" },
    { id:"CONT-006", proyecto:"CENIA-005", proveedor:"Dr. Carlos Herrera",      tipo:"Natural",  monto:6400000,  estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-007", proyecto:"CENIA-003", proveedor:"DevCL SpA",              tipo:"Jurídica", monto:12000000, estado:"Finalizado",art22:"Cumple" },
    { id:"CONT-008", proyecto:"CENIA-004", proveedor:"DataGov Consultores",     tipo:"Jurídica", monto:7500000,  estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-009", proyecto:"CENIA-006", proveedor:"Studio Pedagógico SpA",   tipo:"Jurídica", monto:2100000,  estado:"Vigente",   art22:"Cumple" },
    { id:"CONT-010", proyecto:"CENIA-006", proveedor:"Luis Pérez Profesor",     tipo:"Natural",  monto:1800000,  estado:"Vigente",   art22:"Cumple" },
  ],
  finanzas: {
    ingresos: 92000000,
    gastos: 56950000,
    balance: 35050000,
    presupuestoTotal: 138000000,
    pctEjecucion: 41.3,
    pendientes: 9200000,
  },
  hitos: [
    { id:"H-001", proyecto:"CENIA-001", nombre:"Diseño curricular aprobado",    estado:"Completado",              fecha:"2025-11-15" },
    { id:"H-002", proyecto:"CENIA-001", nombre:"Plataforma e-learning activa",  estado:"Completado",              fecha:"2025-12-01" },
    { id:"H-003", proyecto:"CENIA-001", nombre:"Primera cohorte 50 PYMES",      estado:"Completado",              fecha:"2026-01-28" },
    { id:"H-004", proyecto:"CENIA-001", nombre:"Evaluación formativa T1",       estado:"Completado",              fecha:"2026-02-25" },
    { id:"H-005", proyecto:"CENIA-001", nombre:"Segunda cohorte 50 PYMES",      estado:"En Curso",                fecha:"2026-03-31" },
    { id:"H-006", proyecto:"CENIA-001", nombre:"Informe final y métricas",      estado:"Pendiente",               fecha:"2026-04-30" },
    { id:"H-007", proyecto:"CENIA-002", nombre:"Marco metodológico",            estado:"Completado",              fecha:"2025-12-14" },
    { id:"H-008", proyecto:"CENIA-002", nombre:"Recolección datos 5 países",    estado:"Completado con retraso",  fecha:"2026-02-10" },
    { id:"H-009", proyecto:"CENIA-002", nombre:"Análisis estadístico fase 1",   estado:"Completado",              fecha:"2026-02-26" },
    { id:"H-010", proyecto:"CENIA-002", nombre:"Informe comparativo latam",     estado:"En Curso",                fecha:"2026-04-30" },
    { id:"H-011", proyecto:"CENIA-005", nombre:"Protocolo ético aprobado",      estado:"Completado",              fecha:"2025-09-28" },
    { id:"H-012", proyecto:"CENIA-005", nombre:"Piloto Hospital Sótero",        estado:"Completado",              fecha:"2026-01-15" },
    { id:"H-013", proyecto:"CENIA-005", nombre:"Validación modelo diagnóstico", estado:"En Curso",                fecha:"2026-03-31" },
  ],
  proveedores: {
    natural: 4,
    juridica: 6,
    totalRetencion: 164000,
    totalIVA: 6027370,
  },
};

const fmtCLP = n => new Intl.NumberFormat("es-CL",{style:"currency",currency:"CLP",maximumFractionDigits:0}).format(n);
const now = () => new Date().toLocaleTimeString("es-CL",{hour:"2-digit",minute:"2-digit"});

/* ── REPORT TYPES ─────────────────────────────────────────── */
const REPORT_TYPES = [
  { id:"ejecutivo",    icon:"📊", name:"Informe Ejecutivo",        desc:"Resumen gerencial de todos los proyectos, KPIs financieros y estado general CENIA",   badge:"Popular" },
  { id:"art22",        icon:"⚖️", name:"Cumplimiento Art. 22",     desc:"Análisis detallado de cumplimiento normativo según Ley 19.886 por contrato",          badge:"Legal" },
  { id:"financiero",   icon:"💰", name:"Informe Financiero",       desc:"Ejecución presupuestaria, ingresos, gastos, balance y proyección por proyecto",       badge:null },
  { id:"hitos",        icon:"✅", name:"Estado de Hitos",          desc:"Seguimiento de entregables, retrasos, cumplimiento y evaluación de multas aplicables", badge:null },
  { id:"proveedores",  icon:"👤", name:"Informe de Proveedores",   desc:"Personas naturales y jurídicas, retenciones, IVA y cumplimiento tributario",         badge:"Tributario" },
  { id:"personalizado",icon:"✏️", name:"Informe Personalizado",   desc:"Describe exactamente qué informe necesitas y el agente lo genera a tu medida",        badge:"IA" },
];

const QUICK_PROMPTS = [
  "¿Qué proyectos tienen riesgo de sobreejecutar presupuesto?",
  "Genera el informe Art. 22 del mes de marzo 2026",
  "¿Cuáles contratos tienen hitos retrasados con multa aplicable?",
  "Resume el estado financiero de CENIA-005",
  "Lista las personas naturales con retención pendiente",
  "¿Qué proyectos necesitan atención urgente este trimestre?",
];

const HIST_ITEMS = [
  { tipo:"Ejecutivo",    nombre:"Informe Marzo 2026",         fecha:"04/03/2026 07:30" },
  { tipo:"Art. 22",      nombre:"Cumplimiento Q1 2026",       fecha:"01/03/2026 15:22" },
  { tipo:"Financiero",   nombre:"Ejecución Presupuesto Feb",  fecha:"28/02/2026 09:10" },
  { tipo:"Hitos",        nombre:"Estado Entregables Feb",     fecha:"25/02/2026 11:45" },
];

/* ── BUILD SYSTEM PROMPT ──────────────────────────────────── */
function buildSystemPrompt(reportType) {
  const d = CENIA_DATA;
  const totalHitosOk = d.hitos.filter(h => h.estado === "Completado").length;
  const hitosRetrasados = d.hitos.filter(h => h.estado === "Completado con retraso").length;

  return `Eres el Agente IA de CENIA (Centro Nacional de Inteligencia Artificial de Chile), especializado en generar informes profesionales de gestión de proyectos.

CONTEXTO INSTITUCIONAL:
- Institución: Centro Nacional de Inteligencia Artificial (CENIA), Chile
- Marco legal: Ley 19.886 (Contratos Administrativos), Art. 22 requisitos contractuales
- Normativa tributaria: Retención 10% personas naturales / IVA 19% personas jurídicas
- Fecha actual: ${new Date().toLocaleDateString("es-CL", {day:"2-digit",month:"long",year:"numeric"})}

DATOS ACTUALES DEL SISTEMA:

PROYECTOS (${d.proyectos.length} total):
${d.proyectos.map(p => `- ${p.id}: "${p.nombre}" | Área: ${p.area} | Lead: ${p.lead} | Presupuesto: ${fmtCLP(p.presupuesto)} | Ejecutado: ${fmtCLP(p.ejecutado)} (${Math.round(p.ejecutado/p.presupuesto*100)}%) | Hitos: ${p.hitosOk}/${p.hitos} | Estado: ${p.estado}`).join("\n")}

FINANZAS CONSOLIDADAS:
- Ingresos acreditados: ${fmtCLP(d.finanzas.ingresos)}
- Gastos ejecutados: ${fmtCLP(d.finanzas.gastos)}
- Balance disponible: ${fmtCLP(d.finanzas.balance)}
- Presupuesto total aprobado: ${fmtCLP(d.finanzas.presupuestoTotal)}
- % Ejecución global: ${d.finanzas.pctEjecucion}%
- Pagos pendientes: ${fmtCLP(d.finanzas.pendientes)}

CONTRATOS (${d.contratos.length} total):
${d.contratos.map(c => `- ${c.id}: ${c.proveedor} | Proyecto: ${c.proyecto} | Tipo: ${c.tipo} | Monto: ${fmtCLP(c.monto)} | Estado: ${c.estado} | Art.22: ${c.art22}`).join("\n")}

HITOS (${d.hitos.length} total):
- Completados: ${totalHitosOk}
- Con retraso: ${hitosRetrasados}
- En curso: ${d.hitos.filter(h=>h.estado==="En Curso").length}
- Pendientes: ${d.hitos.filter(h=>h.estado==="Pendiente").length}
${d.hitos.map(h => `- ${h.id}: "${h.nombre}" | Proyecto: ${h.proyecto} | Estado: ${h.estado} | Fecha: ${h.fecha}`).join("\n")}

PROVEEDORES:
- Personas Naturales: ${d.proveedores.natural} (retención 10%: ${fmtCLP(d.proveedores.totalRetencion)})
- Personas Jurídicas: ${d.proveedores.juridica} (IVA 19%: ${fmtCLP(d.proveedores.totalIVA)})

TIPO DE INFORME SOLICITADO: ${reportType || "General"}

INSTRUCCIONES DE FORMATO:
1. Genera informes profesionales y estructurados con secciones claras
2. Usa ## para títulos de sección y ### para subsecciones
3. Incluye siempre: Resumen Ejecutivo, análisis detallado, conclusiones y recomendaciones
4. Para informes Art. 22: verifica cada uno de los 8 requisitos por contrato
5. Para informes financieros: incluye tablas con montos en CLP
6. Cita siempre el marco legal aplicable (Art. 22 Ley 19.886, Ley IR, DL 825)
7. Usa lenguaje formal pero claro, apropiado para un centro de investigación público chileno
8. Incluye KPIs numéricos concretos en cada informe
9. Señala alertas, riesgos y recomendaciones de acción al final
10. Los informes deben ser usables directamente en contextos institucionales CENIA`;
}

/* ── TOAST ────────────────────────────────────────────────── */
function Toast({msg, onClose}) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return <div className="toast"><span>✓</span><span>{msg}</span></div>;
}

/* ── THINKING ANIMATION ───────────────────────────────────── */
function Thinking() {
  return (
    <div className="msg fi">
      <div className="msg-av agent">🤖</div>
      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-who">Agente CENIA IA</span>
          <span className="msg-tag">Generando informe…</span>
        </div>
        <div className="thinking">
          <span/><span/><span/>
        </div>
      </div>
    </div>
  );
}

/* ── RENDER MESSAGE ───────────────────────────────────────── */
function MsgText({text}) {
  const lines = text.split("\n");
  const parts = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      parts.push(<h2 key={i}>{line.slice(3)}</h2>);
    } else if (line.startsWith("### ")) {
      parts.push(<h3 key={i}>{line.slice(4)}</h3>);
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• "))) {
        items.push(<li key={i}>{lines[i].slice(2)}</li>);
        i++;
      }
      parts.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    } else if (line.trim() === "") {
      parts.push(<br key={i}/>);
    } else {
      // bold processing
      const bold = line.replace(/\*\*(.*?)\*\*/g, (_, t) => `<strong>${t}</strong>`);
      parts.push(<p key={i} dangerouslySetInnerHTML={{__html: bold}}/>);
    }
    i++;
  }

  return <div className="msg-text">{parts}</div>;
}

/* ── MAIN APP ─────────────────────────────────────────────── */
export default function App() {
  const [page, setPage] = useState("agente");
  const [selectedType, setSelectedType] = useState("ejecutivo");
  const [messages, setMessages] = useState([
    {
      role: "agent",
      content: `## Bienvenido al Agente IA de CENIA

Soy tu asistente especializado en generación de informes institucionales. Tengo acceso en tiempo real a todos los datos de proyectos, contratos, finanzas e hitos de CENIA.

**¿Qué puedo hacer por ti?**

- Generar informes ejecutivos, financieros y de cumplimiento
- Analizar el estado de contratos bajo el **Art. 22 Ley 19.886**
- Revisar retenciones de personas naturales e IVA de personas jurídicas
- Alertar sobre hitos retrasados y multas aplicables
- Responder preguntas específicas sobre cualquier proyecto CENIA

**Selecciona el tipo de informe** en el panel de la derecha o escríbeme directamente qué necesitas.`,
      time: now(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [progress, setProgress] = useState(0);
  const chatRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = text.trim();
    setInput("");
    setMessages(prev => [...prev, { role:"user", content: userMsg, time: now() }]);
    setLoading(true);
    setProgress(0);

    // Animate progress
    let p = 0;
    const timer = setInterval(() => {
      p = Math.min(p + Math.random() * 12, 85);
      setProgress(p);
    }, 300);

    try {
      const systemPrompt = buildSystemPrompt(
        REPORT_TYPES.find(r => r.id === selectedType)?.name || "General"
      );

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            ...messages
              .filter(m => m.role !== "agent" || messages.indexOf(m) > 0)
              .map(m => ({
                role: m.role === "agent" ? "assistant" : "user",
                content: m.content
              })),
            { role: "user", content: userMsg }
          ]
        })
      });

      const data = await response.json();
      clearInterval(timer);
      setProgress(100);

      const reply = data.content?.[0]?.text || "No se pudo generar el informe. Intenta nuevamente.";
      setTimeout(() => {
        setMessages(prev => [...prev, { role:"agent", content: reply, time: now() }]);
        setLoading(false);
        setProgress(0);
      }, 300);

    } catch (err) {
      clearInterval(timer);
      setLoading(false);
      setProgress(0);
      setMessages(prev => [...prev, {
        role: "agent",
        content: "⚠️ Error de conexión con el modelo. Verifica tu conexión e intenta nuevamente.",
        time: now()
      }]);
    }
  }, [loading, messages, selectedType]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyLast = () => {
    const agentMsgs = messages.filter(m => m.role === "agent");
    const last = agentMsgs[agentMsgs.length - 1];
    if (last) {
      navigator.clipboard.writeText(last.content).catch(() => {});
      setToast("Informe copiado al portapapeles");
    }
  };

  const generateReport = () => {
    const type = REPORT_TYPES.find(r => r.id === selectedType);
    const prompts = {
      ejecutivo: "Genera el informe ejecutivo completo de CENIA con el estado actual de todos los proyectos, KPIs financieros consolidados y principales alertas del período.",
      art22: "Genera el informe de cumplimiento del Artículo 22 Ley 19.886 para todos los contratos CENIA. Verifica cada uno de los 8 requisitos, identifica incumplimientos y emite recomendaciones.",
      financiero: "Genera el informe financiero completo con ejecución presupuestaria por proyecto, análisis de ingresos y gastos, balance disponible, pagos pendientes y proyección al cierre.",
      hitos: "Genera el informe de estado de hitos y entregables. Identifica hitos completados, en curso, retrasados y evalúa multas aplicables según los contratos.",
      proveedores: "Genera el informe de proveedores y contratistas CENIA. Detalla personas naturales con retención 10%, personas jurídicas con IVA 19%, y cumplimiento tributario.",
      personalizado: "Describe el informe que necesitas y lo generaré a tu medida:",
    };
    if (selectedType === "personalizado") {
      setInput("Necesito un informe sobre ");
      textareaRef.current?.focus();
      return;
    }
    sendMessage(prompts[selectedType] || `Genera el informe de tipo: ${type?.name}`);
  };

  const clearChat = () => {
    setMessages([{
      role: "agent",
      content: "Chat limpiado. ¿Qué informe necesitas generar?",
      time: now()
    }]);
  };

  const d = CENIA_DATA;
  const totalPresupuesto = d.proyectos.reduce((s, p) => s + p.presupuesto, 0);
  const totalEjecutado = d.proyectos.reduce((s, p) => s + p.ejecutado, 0);

  return (
    <>
      <style>{FONTS + CSS}</style>
      <div className="shell">

        {/* TOPBAR */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-hex">
              <span style={{fontSize:13,fontWeight:800,color:"#fff",fontFamily:"Syne"}}>IA</span>
            </div>
            <div>
              <div className="brand-name">CENIA Agente IA</div>
              <div className="brand-tag">GENERADOR DE INFORMES · LEY 19.886</div>
            </div>
          </div>
          <div className="topbar-r">
            <div className="model-badge">
              <div className="model-dot"/>
              claude-sonnet-4 · activo
            </div>
            <div className="status-bar">
              {messages.length - 1} informes generados
            </div>
          </div>
        </header>

        {/* SIDEBAR */}
        <nav className="sidebar">
          <div className="nav-sec">Navegación</div>
          {[
            { id:"agente",   ico:"🤖", label:"Agente Generador" },
            { id:"historial",ico:"📋", label:"Historial Informes", count: HIST_ITEMS.length },
            { id:"datos",    ico:"📊", label:"Datos del Sistema" },
          ].map(item => (
            <div key={item.id}
              className={`nav-item${page === item.id ? " on" : ""}`}
              onClick={() => setPage(item.id)}>
              <span className="nav-ico">{item.ico}</span>
              {item.label}
              {item.count && <span className="nav-count">{item.count}</span>}
            </div>
          ))}

          <div className="nav-sec" style={{marginTop:8}}>Tipos de Informe</div>
          {REPORT_TYPES.map(rt => (
            <div key={rt.id}
              className={`nav-item${selectedType === rt.id && page === "agente" ? " on" : ""}`}
              onClick={() => { setSelectedType(rt.id); setPage("agente"); }}>
              <span className="nav-ico">{rt.icon}</span>
              <span style={{fontSize:11.5}}>{rt.name}</span>
            </div>
          ))}

          <div className="nav-foot">
            <div className="nav-hint">
              Agente con acceso a datos<br/>
              en tiempo real · Art. 22<br/>
              Ley 19.886 · CENIA 2026
            </div>
          </div>
        </nav>

        {/* MAIN */}
        <main className="main">

          {/* ── AGENTE PAGE ── */}
          {page === "agente" && (
            <div>
              <div className="ph fu">
                <div className="ph-title">Agente Generador de Informes</div>
                <div className="ph-sub">CENTRO NACIONAL DE INTELIGENCIA ARTIFICIAL · POWERED BY CLAUDE</div>
                <div className="ph-actions">
                  <button className="btn btn-ghost btn-sm" onClick={clearChat}>🗑 Limpiar chat</button>
                  <button className="btn btn-ghost btn-sm" onClick={copyLast}>📋 Copiar último informe</button>
                </div>
              </div>

              {/* Report type selector */}
              <div className="rtype-grid fu">
                {REPORT_TYPES.map(rt => (
                  <div key={rt.id}
                    className={`rtype${selectedType === rt.id ? " on" : ""}`}
                    onClick={() => setSelectedType(rt.id)}>
                    {selectedType === rt.id
                      ? <div className="rtype-check">✓</div>
                      : rt.badge && <div className="rtype-badge">{rt.badge}</div>}
                    <div className="rtype-ico">{rt.icon}</div>
                    <div className="rtype-name">{rt.name}</div>
                    <div className="rtype-desc">{rt.desc}</div>
                  </div>
                ))}
              </div>

              {/* Generate button */}
              <div style={{display:"flex",gap:10,marginBottom:20,alignItems:"center"}} className="fu1">
                <button className="btn btn-blue" onClick={generateReport} disabled={loading}>
                  {loading ? "⏳ Generando…" : `⚡ Generar ${REPORT_TYPES.find(r=>r.id===selectedType)?.name}`}
                </button>
                <span style={{fontSize:11.5,color:"var(--ink3)"}}>
                  o escribe tu consulta abajo →
                </span>
              </div>

              {/* Progress */}
              {loading && (
                <div className="mb fi">
                  <div style={{fontSize:11,color:"var(--blue)",marginBottom:4,fontFamily:"var(--fm)"}}>
                    Analizando datos CENIA y redactando informe… {Math.round(progress)}%
                  </div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{width:`${progress}%`}}/>
                  </div>
                </div>
              )}

              {/* Chat window */}
              <div className="card fu2" style={{padding:0,overflow:"hidden"}}>
                <div style={{padding:"12px 20px",background:"var(--off2)",borderBottom:"1px solid var(--border)",
                  display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:11.5,fontWeight:700,color:"var(--ink3)",letterSpacing:".05em",textTransform:"uppercase"}}>
                    Conversación con el Agente
                  </span>
                  <span className="tag tag-blue">{messages.length} mensajes</span>
                </div>
                <div ref={chatRef} style={{padding:"8px 20px",maxHeight:480,overflowY:"auto"}}>
                  <div className="chat-wrap">
                    {messages.map((m, i) => (
                      <div key={i} className="msg" style={{animationDelay:`${i*.03}s`}}>
                        <div className={`msg-av ${m.role}`}>
                          {m.role === "agent" ? "🤖" : "CG"}
                        </div>
                        <div className="msg-body">
                          <div className="msg-meta">
                            <span className="msg-who">
                              {m.role === "agent" ? "Agente CENIA IA" : "Coordinación Proyectos"}
                            </span>
                            <span className="msg-time">{m.time}</span>
                            {m.role === "agent" && i > 0 && (
                              <button className="copy-btn"
                                onClick={() => {navigator.clipboard.writeText(m.content).catch(()=>{}); setToast("Copiado");}}>
                                📋
                              </button>
                            )}
                          </div>
                          <MsgText text={m.content}/>
                        </div>
                      </div>
                    ))}
                    {loading && <Thinking/>}
                  </div>
                </div>

                {/* Input */}
                <div style={{padding:"14px 20px",borderTop:"1px solid var(--border)",background:"var(--white)"}}>
                  <div className="input-row">
                    <textarea
                      ref={textareaRef}
                      className="input-field"
                      rows={2}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKey}
                      placeholder="Escribe tu consulta o solicitud de informe… (Enter para enviar, Shift+Enter para nueva línea)"
                      disabled={loading}
                    />
                    <button className="btn btn-blue" onClick={() => sendMessage(input)} disabled={loading || !input.trim()}>
                      {loading ? <span style={{animation:"spin 1s linear infinite",display:"inline-block"}}>⟳</span> : "Enviar →"}
                    </button>
                  </div>
                  <div className="input-hints">
                    {QUICK_PROMPTS.map((p, i) => (
                      <span key={i} className="hint-pill"
                        onClick={() => sendMessage(p)}>
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── HISTORIAL PAGE ── */}
          {page === "historial" && (
            <div>
              <div className="ph fu">
                <div className="ph-title">Historial de Informes</div>
                <div className="ph-sub">INFORMES GENERADOS ANTERIORMENTE</div>
              </div>
              <div className="card fu1">
                {HIST_ITEMS.map((h, i) => (
                  <div key={i} className="hist-item" onClick={() => {setPage("agente");}}>
                    <div className="hist-type">{h.tipo}</div>
                    <div className="hist-name">{h.nombre}</div>
                    <div className="hist-date">{h.fecha}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DATOS PAGE ── */}
          {page === "datos" && (
            <div>
              <div className="ph fu">
                <div className="ph-title">Datos del Sistema</div>
                <div className="ph-sub">DATOS QUE EL AGENTE UTILIZA PARA GENERAR INFORMES</div>
              </div>

              {/* KPIs */}
              <div className="ctx-grid fu">
                <div className="ctx-item">
                  <div className="ctx-lbl">Proyectos</div>
                  <div className="ctx-val">{d.proyectos.length}</div>
                  <div className="ctx-sub">{d.proyectos.filter(p=>p.estado==="En Curso").length} en curso</div>
                </div>
                <div className="ctx-item">
                  <div className="ctx-lbl">Contratos</div>
                  <div className="ctx-val">{d.contratos.length}</div>
                  <div className="ctx-sub">10/10 Art.22 OK</div>
                </div>
                <div className="ctx-item">
                  <div className="ctx-lbl">Presupuesto</div>
                  <div className="ctx-val">$138M</div>
                  <div className="ctx-sub">{Math.round(totalEjecutado/totalPresupuesto*100)}% ejecutado</div>
                </div>
                <div className="ctx-item">
                  <div className="ctx-lbl">Hitos</div>
                  <div className="ctx-val">{d.hitos.length}</div>
                  <div className="ctx-sub">{d.hitos.filter(h=>h.estado==="Completado").length} completados</div>
                </div>
              </div>

              {/* Projects table */}
              <div className="card fu1 mb">
                <div className="card-title">Proyectos Cargados</div>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr>
                      {["ID","Nombre","Presupuesto","Ejecutado","% Ejec.","Hitos","Estado"].map(h => (
                        <th key={h} style={{padding:"7px 10px",background:"var(--ink)",color:"#fff",
                          textAlign:"left",fontSize:10,fontWeight:700,letterSpacing:".05em",textTransform:"uppercase"}}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.proyectos.map((p,i) => (
                      <tr key={p.id}>
                        {[
                          <span style={{fontFamily:"var(--fm)",color:"var(--blue)",fontWeight:600,fontSize:11}}>{p.id}</span>,
                          p.nombre,
                          <span style={{fontFamily:"var(--fm)",fontSize:11}}>{fmtCLP(p.presupuesto)}</span>,
                          <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--teal)"}}>{fmtCLP(p.ejecutado)}</span>,
                          <span style={{fontWeight:700,color:p.ejecutado/p.presupuesto>.9?"var(--red)":"var(--blue)"}}>
                            {Math.round(p.ejecutado/p.presupuesto*100)}%
                          </span>,
                          `${p.hitosOk}/${p.hitos}`,
                          <span className={`badge badge-${p.estado==="En Curso"||p.estado==="Activo"?"ok":p.estado==="Pendiente"?"warn":"ok"}`}>
                            {p.estado}
                          </span>
                        ].map((v, j) => (
                          <td key={j} style={{padding:"9px 10px",borderBottom:"1px solid var(--off2)",
                            background: i%2===1?"var(--off2)":"var(--white)",verticalAlign:"middle"}}>
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="g2">
                <div className="card">
                  <div className="card-title">Contratos + Art. 22</div>
                  {d.contratos.map((c,i) => (
                    <div key={c.id} style={{display:"flex",justifyContent:"space-between",
                      alignItems:"center",padding:"8px 0",borderBottom:"1px solid var(--off2)",fontSize:12}}>
                      <div>
                        <span style={{fontFamily:"var(--fm)",color:"var(--blue)",fontSize:11,fontWeight:600}}>{c.id}</span>
                        <span style={{marginLeft:8,color:"var(--ink2)"}}>{c.proveedor}</span>
                        <span style={{marginLeft:6,fontSize:10,padding:"1px 6px",borderRadius:10,
                          background: c.tipo==="Natural"?"var(--amber-xl)":"var(--blue-xl)",
                          color: c.tipo==="Natural"?"var(--amber)":"var(--blue)",fontWeight:600}}>
                          {c.tipo}
                        </span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontFamily:"var(--fm)",fontSize:11,color:"var(--ink3)"}}>{fmtCLP(c.monto)}</span>
                        <span className="badge badge-ok">Art.22 ✓</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card">
                  <div className="card-title">Hitos por Estado</div>
                  {[
                    {label:"Completados",    color:"var(--green)", bg:"var(--green-xl)",  n: d.hitos.filter(h=>h.estado==="Completado").length},
                    {label:"Con retraso",    color:"var(--red)",   bg:"var(--red-xl)",    n: d.hitos.filter(h=>h.estado==="Completado con retraso").length},
                    {label:"En Curso",       color:"var(--blue)",  bg:"var(--blue-xl)",   n: d.hitos.filter(h=>h.estado==="En Curso").length},
                    {label:"Pendientes",     color:"var(--amber)", bg:"var(--amber-xl)",  n: d.hitos.filter(h=>h.estado==="Pendiente").length},
                  ].map(s => (
                    <div key={s.label} style={{marginBottom:12}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                        <span style={{fontSize:12,color:"var(--ink2)"}}>{s.label}</span>
                        <span style={{fontWeight:700,color:s.color,fontSize:13}}>{s.n}</span>
                      </div>
                      <div className="prog-bar" style={{marginTop:0}}>
                        <div style={{height:"100%",width:`${s.n/d.hitos.length*100}%`,
                          background:s.color,borderRadius:2,transition:"width 1s ease"}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:16,padding:"10px 14px",background:"var(--sky3)",
                    border:"1px solid var(--sky2)",borderRadius:8,fontSize:11.5,color:"var(--blue)"}}>
                    El agente tiene acceso completo a estos datos para generar informes precisos.
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)}/>}
    </>
  );
}
