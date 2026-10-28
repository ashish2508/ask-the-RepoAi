import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ArrowRight, Bot, Braces, GitBranch, Github, Search, Sparkles } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Search,
    title: "Find answers in your code",
    description: "Ask a question in plain language and get a grounded answer with the files that matter.",
  },
  {
    icon: GitBranch,
    title: "Catch up on every change",
    description: "Turn recent commits into clear summaries, so you can follow the project as it evolves.",
  },
  {
    icon: Braces,
    title: "Understand the structure",
    description: "Explore a repository with concise explanations of what each part does and how it fits.",
  },
];

export default function Home() {
  return (
    <main className="landing-shell min-h-screen overflow-hidden">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight text-foreground">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/15">
            <Bot className="size-5" />
          </span>
          <span className="text-lg">Ask the <span className="text-primary">RepoAI</span></span>
        </Link>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground" href="/sign-in">Sign in</Link>
            <Link className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-primary/90" href="/sign-up">Get started <ArrowRight className="ml-1 inline size-4" /></Link>
          </SignedOut>
          <SignedIn>
            <Link className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90" href="/dashboard">Open workspace <ArrowRight className="ml-1 inline size-4" /></Link>
          </SignedIn>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 pb-24 pt-16 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:pb-32 lg:pt-24">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-3.5 py-2 text-xs font-semibold text-primary shadow-sm shadow-primary/5">
            <Sparkles className="size-3.5" /> Your codebase, easier to understand
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-[-.055em] text-foreground sm:text-6xl lg:text-7xl">
            Get to know any repo <span className="landing-gradient">like you built it.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            Connect a GitHub repository, ask how it works, and get clear answers grounded in the code and its commit history.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <SignedOut>
              <Link className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90" href="/sign-up">Start exploring <ArrowRight className="ml-2 inline size-4" /></Link>
              <Link className="rounded-full border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground/90 transition hover:border-border hover:bg-muted" href="/sign-in">I already have an account</Link>
            </SignedOut>
            <SignedIn>
              <Link className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/15 transition hover:-translate-y-0.5 hover:bg-primary/90" href="/dashboard">Go to your workspace <ArrowRight className="ml-2 inline size-4" /></Link>
            </SignedIn>
          </div>
          <div className="mt-9 flex items-center gap-2 text-sm text-muted-foreground"><Github className="size-4 text-foreground" /> Built around the repositories you already use</div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div className="landing-orb absolute -inset-10 rounded-full blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_100px_-35px_rgba(0,0,0,.45)]">
            <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
              <div className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-rose-400"/><span className="size-2.5 rounded-full bg-amber-400"/><span className="size-2.5 rounded-full bg-emerald-400"/></div>
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground"><Github className="size-3.5"/> acme / storefront</div>
              <div className="size-4" />
            </div>
            <div className="bg-background p-6 sm:p-8">
              <div className="mb-7 flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Bot className="size-5"/></div><div><p className="text-sm font-semibold text-foreground">Ask your repository</p><p className="text-xs text-muted-foreground">Answers linked to source files</p></div></div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-secondary px-4 py-3 text-sm leading-6 text-secondary-foreground">Where is the checkout flow handled?</div>
              <div className="mt-5 flex gap-3"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"><Sparkles className="size-4"/></div><div className="min-w-0"><p className="text-sm leading-6 text-foreground/90">The checkout flow starts in the cart page and submits through the checkout API route.</p><div className="mt-4 space-y-2"><div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-card px-3 py-2.5 text-xs font-medium text-muted-foreground"><Braces className="size-3.5 text-primary"/> src/app/cart/page.tsx <span className="ml-auto text-primary">Referenced file</span></div><div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-card px-3 py-2.5 text-xs font-medium text-muted-foreground"><Braces className="size-3.5 text-primary"/> src/app/api/checkout/route.ts <span className="ml-auto text-primary">Referenced file</span></div></div></div></div>
              <div className="mt-7 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm"><span>Ask anything about this codebase…</span><span className="ml-auto grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><ArrowRight className="size-4"/></span></div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border/70 border-t border-border/70 bg-card py-4 text-center"><div><p className="text-sm font-semibold text-foreground">Repository-aware</p><p className="mt-1 text-[11px] text-muted-foreground">Grounded in your code</p></div><div><p className="text-sm font-semibold text-foreground">Commit insights</p><p className="mt-1 text-[11px] text-muted-foreground">Changes made clearer</p></div><div><p className="text-sm font-semibold text-foreground">Made for teams</p><p className="mt-1 text-[11px] text-muted-foreground">Share context faster</p></div></div>
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card px-6 py-20 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-primary">A better way to explore</p><h2 className="mt-4 text-3xl font-semibold tracking-[-.04em] text-foreground sm:text-4xl">Less searching. More understanding.</h2><p className="mt-4 leading-7 text-muted-foreground">Get useful context without tracing every import or reading every commit from the beginning.</p></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, description }, index) => <article key={title} className="rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/10 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20"><div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5"/></div><p className="mt-6 text-xs font-semibold text-primary">0{index + 1}</p><h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-10"><Link href="/" className="font-semibold text-foreground">Ask the RepoAI</Link><span>Make the next codebase feel familiar.</span></footer>
    </main>
  );
}
