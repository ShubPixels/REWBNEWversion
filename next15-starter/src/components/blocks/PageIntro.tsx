export interface PageIntroData {
  eyebrow: string;
  title: string;
  description: string;
}

export interface PageIntroProps {
  data: PageIntroData;
  blockId: string;
}

export default function PageIntro({ data, blockId }: PageIntroProps) {
  return (
    <section id={blockId} className="mx-auto w-full max-w-5xl px-4 py-16 text-center">
      {data.eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{data.eyebrow}</p>
      ) : null}
      {data.title ? <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">{data.title}</h1> : null}
      {data.description ? <p className="mx-auto mt-4 max-w-3xl text-base text-slate-600">{data.description}</p> : null}
    </section>
  );
}
