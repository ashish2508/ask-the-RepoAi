export default function ProtectedLoading() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse space-y-8" aria-label="Loading workspace">
      <div className="flex items-end justify-between border-b border-border pb-7">
        <div className="space-y-3"><div className="h-3 w-28 bg-muted" /><div className="h-10 w-72 bg-muted" /><div className="h-4 w-96 max-w-full bg-muted" /></div>
        <div className="hidden h-10 w-36 bg-muted sm:block" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_18rem]"><div className="h-64 bg-muted" /><div className="h-64 bg-muted" /></div>
      <div className="h-48 bg-muted" />
    </div>
  );
}
