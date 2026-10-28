"use client";

import {
  Activity,
  ArrowUpRight,
  Bot,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  FileCode2,
  GitCommitHorizontal,
  GitFork,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  TerminalSquare,
  X,
} from "lucide-react";
import { useState } from "react";

const concepts = [
  {
    id: "foundry",
    name: "Foundry",
    label: "Warm editorial",
    description: "A confident studio workspace with ink-black structure, copper actions, and generous editorial rhythm.",
    fit: "Best overall fit",
    colors: "Ink / Copper / Linen",
    scores: [9, 9, 8, 8, 9, 9],
    bg: "#151515",
    surface: "#202020",
    panel: "#292827",
    text: "#f6efe5",
    muted: "#a9a198",
    accent: "#e98b52",
    accentSoft: "#432d22",
    line: "#3a3733",
    type: "font-sans",
  },
  {
    id: "nightshift",
    name: "Nightshift",
    label: "Terminal intelligence",
    description: "A dense developer console with phosphor green signals, sharp geometry, and instant project status.",
    fit: "Best for power users",
    colors: "Graphite / Lime / Cyan",
    scores: [8, 10, 9, 8, 9, 8],
    bg: "#0b1110",
    surface: "#101a17",
    panel: "#14221d",
    text: "#e6f4e9",
    muted: "#7d9a8b",
    accent: "#b9ed65",
    accentSoft: "#263b25",
    line: "#26382f",
    type: "font-mono",
  },
  {
    id: "tidepool",
    name: "Tidepool",
    label: "Calm systems",
    description: "A clear, oceanic interface that turns complex codebase context into an easy-to-scan working surface.",
    fit: "Best for approachability",
    colors: "Deep navy / Aqua / Mist",
    scores: [9, 9, 10, 10, 8, 9],
    bg: "#071c2a",
    surface: "#0d2b3c",
    panel: "#12384b",
    text: "#edf8fa",
    muted: "#8eafb9",
    accent: "#5fe0d1",
    accentSoft: "#16494c",
    line: "#235064",
    type: "font-sans",
  },
  {
    id: "atelier",
    name: "Atelier",
    label: "Quiet premium",
    description: "A refined research desk with parchment surfaces, oxblood accents, and a high-trust reading experience.",
    fit: "Best for onboarding",
    colors: "Parchment / Oxblood / Moss",
    scores: [10, 8, 9, 9, 8, 8],
    bg: "#f1ede5",
    surface: "#fbf8f2",
    panel: "#e7e0d4",
    text: "#292722",
    muted: "#736d63",
    accent: "#a9443b",
    accentSoft: "#f0d7d1",
    line: "#d8cfc2",
    type: "font-sans",
  },
  {
    id: "signal",
    name: "Signal",
    label: "Bold navigation",
    description: "A high-contrast command center that makes the next action obvious and project health impossible to miss.",
    fit: "Best for fast scanning",
    colors: "Cobalt / Sun / White",
    scores: [8, 9, 8, 8, 10, 8],
    bg: "#11245e",
    surface: "#1b347e",
    panel: "#244496",
    text: "#f5f7ff",
    muted: "#b8c5ed",
    accent: "#f5cf54",
    accentSoft: "#4e4b2b",
    line: "#3555a0",
    type: "font-sans",
  },
  {
    id: "meadow",
    name: "Meadow",
    label: "Friendly clarity",
    description: "A light, optimistic workspace for teams who want repository knowledge to feel welcoming from the first click.",
    fit: "Best for mixed teams",
    colors: "Sage / Coral / Cream",
    scores: [9, 8, 9, 9, 8, 9],
    bg: "#e9eee5",
    surface: "#f8faf5",
    panel: "#dce7d9",
    text: "#233229",
    muted: "#68766b",
    accent: "#e06d56",
    accentSoft: "#f5d6cd",
    line: "#cbd8c9",
    type: "font-sans",
  },
];

const commits = [
  { hash: "a3b91c2", title: "Improve repository overview", age: "12 min ago", tone: "accent" },
  { hash: "81f0a77", title: "Add video processing route", age: "2 hr ago", tone: "muted" },
  { hash: "5cd20ae", title: "Tighten project permissions", age: "Yesterday", tone: "muted" },
];

function Score({ scores }: { scores: number[] }) {
  const labels = ["Visual", "Clarity", "Hierarchy", "Access", "Responsive", "Fit"];
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
      {labels.map((label, index) => {
        const score = scores[index] ?? 0;
        return (
        <div key={label}>
          <div className="flex justify-between text-[10px] uppercase tracking-wider opacity-60"><span>{label}</span><span>{score}/10</span></div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-current/10"><div className="h-full rounded-full bg-current" style={{ width: `${score * 10}%` }} /></div>
        </div>
        );
      })}
    </div>
  );
}

function Preview({ concept }: { concept: (typeof concepts)[number] }) {
  return (
    <div className={`overflow-hidden rounded-[1.4rem] border shadow-2xl ${concept.type}`} style={{ background: concept.bg, color: concept.text, borderColor: concept.line }}>
      <div className="flex min-h-[31rem]">
        <aside className="hidden w-44 shrink-0 border-r p-4 sm:block" style={{ borderColor: concept.line, background: concept.surface }}>
          <div className="flex items-center gap-2 text-sm font-bold"><span className="grid size-7 place-items-center rounded-lg" style={{ background: concept.accent, color: concept.bg }}><Bot className="size-4" /></span> repo<span style={{ color: concept.accent }}>ai</span></div>
          <div className="mt-9 text-[9px] font-bold uppercase tracking-[.18em] opacity-45">Workspace</div>
          <div className="mt-3 space-y-1 text-xs">
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 font-semibold" style={{ background: concept.accentSoft, color: concept.accent }}><LayoutDashboard className="size-3.5" /> Overview</div>
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 opacity-70"><MessageSquareText className="size-3.5" /> Ask the repo</div>
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 opacity-70"><GitCommitHorizontal className="size-3.5" /> Changes</div>
          </div>
          <div className="mt-8 text-[9px] font-bold uppercase tracking-[.18em] opacity-45">Projects</div>
          <div className="mt-3 space-y-2 text-xs opacity-80"><div className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-md text-[10px] font-bold" style={{ background: concept.accent, color: concept.bg }}>F</span> ffmpeg</div><div className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-md text-[10px] font-bold" style={{ background: concept.panel }}>N</span> neon</div><div className="flex items-center gap-2"><span className="grid size-5 place-items-center rounded-md text-[10px] font-bold" style={{ background: concept.panel }}>Y</span> yaml</div></div>
          <div className="mt-auto pt-16 text-xs opacity-55"><Settings2 className="mb-2 size-4" /> Settings</div>
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: concept.line }}><div className="flex items-center gap-2 text-xs opacity-60"><Menu className="size-4 sm:hidden" /> Workspace / <span style={{ color: concept.text }}>ffmpeg</span></div><div className="flex items-center gap-2"><div className="hidden items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[10px] opacity-60 sm:flex" style={{ borderColor: concept.line }}><Search className="size-3" /> Search repository</div><span className="size-6 rounded-full" style={{ background: concept.accent }} /></div></div>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em]" style={{ color: concept.accent }}><CircleDot className="size-3" /> Repository pulse</div><h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Understand ffmpeg.</h3><p className="mt-2 max-w-md text-xs leading-5 opacity-60">Ask questions, trace changes, and build context around the code that matters.</p></div><div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs" style={{ borderColor: concept.line, background: concept.surface }}><Activity className="size-3.5" style={{ color: concept.accent }} /> Indexed <strong>94%</strong></div></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl p-3" style={{ background: concept.surface }}><div className="flex items-center justify-between text-[10px] opacity-55"><span>Repository files</span><Code2 className="size-3.5" /></div><div className="mt-3 text-xl font-bold">248</div></div><div className="rounded-xl p-3" style={{ background: concept.surface }}><div className="flex items-center justify-between text-[10px] opacity-55"><span>Recent changes</span><GitFork className="size-3.5" /></div><div className="mt-3 text-xl font-bold">12</div></div><div className="rounded-xl p-3" style={{ background: concept.surface }}><div className="flex items-center justify-between text-[10px] opacity-55"><span>Last indexed</span><Sparkles className="size-3.5" /></div><div className="mt-3 text-xl font-bold">2m ago</div></div></div>
          <div className="mt-5 grid gap-3 md:grid-cols-[1.25fr_.75fr]"><div className="rounded-xl border p-4" style={{ borderColor: concept.line, background: concept.surface }}><div className="flex items-center justify-between"><span className="text-xs font-bold">Ask the repository</span><ArrowUpRight className="size-3.5" style={{ color: concept.accent }} /></div><div className="mt-3 rounded-lg border px-3 py-3 text-[11px] opacity-55" style={{ borderColor: concept.line }}>How does video processing flow through this project?</div><div className="mt-3 flex justify-end"><span className="rounded-lg px-3 py-2 text-[10px] font-bold" style={{ background: concept.accent, color: concept.bg }}>Ask question <ChevronRight className="ml-1 inline size-3" /></span></div></div><div className="rounded-xl border p-4" style={{ borderColor: concept.line, background: concept.surface }}><div className="flex items-center justify-between"><span className="text-xs font-bold">Latest changes</span><MoreHorizontal className="size-3.5 opacity-55" /></div><div className="mt-3 space-y-3">{commits.map((commit) => <div key={commit.hash} className="flex gap-2"><span className="mt-1 size-1.5 shrink-0 rounded-full" style={{ background: commit.tone === "accent" ? concept.accent : concept.muted }} /><div className="min-w-0"><p className="truncate text-[10px] font-semibold">{commit.title}</p><p className="mt-0.5 text-[9px] opacity-50">{commit.age}</p></div></div>)}</div></div></div>
        </main>
      </div>
    </div>
  );
}

export default function DesignLabPage() {
  const [selected, setSelected] = useState(0);
  const concept = concepts[selected]!;
  const average = (concept.scores.reduce((sum, score) => sum + score, 0) / concept.scores.length).toFixed(1);

  return (
    <main className="min-h-screen bg-[#111] px-4 py-6 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1440px]">
        <header className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end"><div><div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[.2em] text-[#e98b52]"><Bot className="size-4" /> Ask the RepoAI / design lab</div><h1 className="max-w-3xl text-4xl font-semibold tracking-[-.05em] sm:text-6xl">Six ways to make a codebase feel familiar.</h1><p className="mt-4 max-w-2xl text-sm leading-6 text-white/55">These are isolated visual prototypes using the real product vocabulary: projects, repository health, Q&amp;A, and recent changes. Choose the direction before production implementation.</p></div><div className="flex items-center gap-2 text-xs text-white/45"><TerminalSquare className="size-4" /> Concept review / 01</div></header>
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">{concepts.map((item, index) => <button key={item.id} onClick={() => setSelected(index)} className="group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5" style={{ borderColor: selected === index ? item.accent : "rgba(255,255,255,.1)", background: selected === index ? item.surface : "rgba(255,255,255,.03)" }}><div className="mb-5 flex items-center justify-between"><span className="text-[10px] font-bold uppercase tracking-[.16em] opacity-45">0{index + 1}</span><span className="size-3 rounded-full ring-4 ring-black/10" style={{ background: item.accent }} /></div><div className="font-semibold">{item.name}</div><div className="mt-1 text-xs opacity-50">{item.label}</div></button>)}</div>
        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_22rem] xl:items-start"><div><div className="mb-4 flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Live preview</p><h2 className="mt-2 text-2xl font-semibold">{concept.name}: {concept.label}</h2></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/50">Interactive concept</span></div><Preview concept={concept} /></div><aside className="rounded-3xl border border-white/10 bg-white/[.04] p-6"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em]" style={{ color: concept.accent }}>Design direction</p><h2 className="mt-3 text-3xl font-semibold">{concept.name}</h2></div><span className="text-3xl font-bold" style={{ color: concept.accent }}>{average}</span></div><p className="mt-5 text-sm leading-6 text-white/60">{concept.description}</p><div className="mt-6 space-y-3 border-y border-white/10 py-5 text-xs"><div className="flex justify-between"><span className="text-white/45">Palette</span><span>{concept.colors}</span></div><div className="flex justify-between"><span className="text-white/45">Positioning</span><span>{concept.fit}</span></div><div className="flex justify-between"><span className="text-white/45">Responsive</span><span>Desktop + mobile</span></div></div><Score scores={concept.scores} /><div className="mt-6 rounded-2xl p-4 text-sm leading-6" style={{ background: concept.accentSoft, color: concept.text }}><Check className="mb-2 size-4" style={{ color: concept.accent }} /><strong>What stands out:</strong><p className="mt-1 opacity-75">{selected === 0 ? "A balanced product language: distinctive enough to feel authored, calm enough for daily engineering work." : selected === 1 ? "Fast scanning and high signal density make this ideal for experienced developers." : selected === 2 ? "The strongest readability system for turning technical context into approachable knowledge." : selected === 3 ? "A premium reading environment that makes repository exploration feel deliberate." : selected === 4 ? "Clear action hierarchy and high contrast create momentum in busy work sessions." : "The friendliest entry point for teams with mixed technical confidence."}</p></div></aside></section>
        <section className="mt-10 border-t border-white/10 pt-8"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-white/40">Recommendation</p><h2 className="mt-2 text-2xl font-semibold">My strongest recommendation: Foundry</h2></div><span className="text-xs text-white/45">Scored for a repository intelligence product</span></div><div className="mt-5 grid gap-3 md:grid-cols-3"><div className="rounded-2xl border border-[#e98b52]/40 bg-[#e98b52]/10 p-5"><Sparkles className="size-5 text-[#e98b52]" /><h3 className="mt-4 font-semibold">Why Foundry wins</h3><p className="mt-2 text-sm leading-6 text-white/60">It gives Q&amp;A and commit history enough room to breathe, keeps the product recognizable, and creates a warm but serious environment for repeated use.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><Activity className="size-5 text-white/60" /><h3 className="mt-4 font-semibold">What I would carry over</h3><p className="mt-2 text-sm leading-6 text-white/60">Tidepool’s calm information hierarchy, Nightshift’s status visibility, and Signal’s decisive primary actions.</p></div><div className="rounded-2xl border border-white/10 bg-white/[.04] p-5"><ArrowUpRight className="size-5 text-white/60" /><h3 className="mt-4 font-semibold">Next phase</h3><p className="mt-2 text-sm leading-6 text-white/60">After selection, I’ll apply the chosen system across landing, shell, dashboard, Q&amp;A, create, loading, empty, and error states.</p></div></div></section>
        <footer className="flex items-center justify-between py-8 text-xs text-white/35"><span>Concepts are prototypes, not production routes.</span><span>Pick a name: Foundry, Nightshift, Tidepool, Atelier, Signal, or Meadow.</span></footer>
      </div>
    </main>
  );
}
