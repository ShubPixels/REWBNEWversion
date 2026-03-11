export default function GenericPageLoading() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <div className="animate-pulse space-y-5">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="h-10 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-11/12 rounded bg-slate-200" />
        <div className="h-4 w-9/12 rounded bg-slate-200" />
        <div className="grid grid-cols-1 gap-4 pt-6 md:grid-cols-2">
          <div className="h-40 rounded-xl bg-slate-200" />
          <div className="h-40 rounded-xl bg-slate-200" />
        </div>
      </div>
    </section>
  );
}
