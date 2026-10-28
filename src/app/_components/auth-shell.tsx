import type { ReactNode } from "react";

import { Bot, Braces, GitBranch, ShieldCheck } from "lucide-react";

const signalRows = [
  "                 .       .                 ",
  "        .   .       .       .   .          ",
  "    .       .   .       .       .   .      ",
  " .       .       .   .       .       .     ",
  "    .   .   .       .       .   .          ",
  "        .       .       .       .          ",
  " .   .       .       .   .       .   .     ",
  "    .       .   .       .   .       .      ",
  "        .       .       .       .          ",
  " .       .   .       .       .   .   .     ",
  "    .       .       .   .       .          ",
  "        .   .       .       .       .      ",
];

type AuthShellProps = {
  children: ReactNode;
  mode: "sign-in" | "sign-up";
};

export function AuthShell({ children, mode }: AuthShellProps) {
  const isSignUp = mode === "sign-up";

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto grid min-h-screen max-w-[1440px] lg:grid-cols-[1fr_0.8fr]">
        <section className="relative hidden overflow-hidden border-r border-border bg-muted/20 p-10 lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="relative z-10 flex items-center gap-3 text-sm font-semibold tracking-tight">
            <span className="grid size-9 place-items-center bg-primary text-primary-foreground"><Bot className="size-4" /></span>
            Ask the <span className="text-primary">RepoAI</span>
          </div>
          <div className="relative z-10 max-w-2xl">
            <p className="mb-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.22em] text-primary"><Braces className="size-3.5" /> Repository workbench / {isSignUp ? "01" : "02"}</p>
            <h1 className="max-w-3xl text-6xl font-semibold leading-[.9] tracking-[-.07em] xl:text-8xl">{isSignUp ? "Make unfamiliar code feel familiar." : "Pick up the thread where you left it."}</h1>
            <p className="mt-8 max-w-lg text-base leading-7 text-muted-foreground">{isSignUp ? "Bring a repository into focus with grounded answers, source trails, and a clearer view of what changed." : "Your repositories, questions, and recent changes are waiting on the other side."}</p>
          </div>
          <div className="relative z-10 flex items-end justify-between gap-8 text-xs text-muted-foreground"><div className="flex gap-5"><span className="flex items-center gap-2"><GitBranch className="size-3.5 text-primary" /> Source-aware</span><span className="flex items-center gap-2"><ShieldCheck className="size-3.5 text-primary" /> Private by default</span></div><span className="font-mono text-[10px] opacity-60">{isSignUp ? "NEW_SESSION" : "RESUME_SESSION"}</span></div>
          <pre aria-hidden="true" className="pointer-events-none absolute -bottom-5 right-0 font-mono text-[22px] leading-[1.65] tracking-[.3em] text-primary/20 blur-[.2px]">{signalRows.join("\n")}</pre>
          <div aria-hidden="true" className="pointer-events-none absolute left-[14%] top-[24%] size-72 rounded-full bg-primary/10 blur-3xl" />
        </section>

        <section className="flex min-h-screen flex-col bg-card px-5 py-5 sm:px-8 lg:justify-center lg:px-16 xl:px-24">
          <div className="mb-10 flex items-center gap-3 text-sm font-semibold tracking-tight lg:hidden"><span className="grid size-8 place-items-center bg-primary text-primary-foreground"><Bot className="size-4" /></span> Ask the <span className="text-primary">RepoAI</span></div>
          <div className="relative mb-10 overflow-hidden border-b border-border pb-8 lg:hidden"><p className="mb-3 text-[10px] font-bold uppercase tracking-[.2em] text-primary">Repository workbench / {isSignUp ? "01" : "02"}</p><h1 className="max-w-xl text-4xl font-semibold leading-[.94] tracking-[-.06em]">{isSignUp ? "Make unfamiliar code feel familiar." : "Pick up the thread where you left it."}</h1><p className="mt-4 max-w-lg text-sm leading-6 text-muted-foreground">{isSignUp ? "Grounded answers and a clearer view of what changed." : "Your repositories and questions are waiting on the other side."}</p><pre aria-hidden="true" className="pointer-events-none absolute -bottom-7 right-0 font-mono text-lg leading-[1.5] tracking-[.24em] text-primary/20">{signalRows.slice(0, 7).join("\n")}</pre></div>
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 border-l-2 border-primary pl-5"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-primary">{isSignUp ? "Create your workspace" : "Welcome back"}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight">{isSignUp ? "Start with your codebase." : "Return to the workbench."}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{isSignUp ? "A clearer way to understand the repositories you already use." : "Continue exploring the repositories you have connected."}</p></div>
            <div className="auth-card">{children}</div>
          </div>
          <p className="mx-auto mt-8 w-full max-w-md text-center text-[11px] leading-5 text-muted-foreground">By continuing, you agree to use RepoAI with repositories you have permission to access.</p>
        </section>
      </div>
    </main>
  );
}
