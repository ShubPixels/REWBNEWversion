import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="mx-auto flex min-h-[55vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900">Product not found</h1>
      <p className="mt-4 max-w-xl text-sm text-slate-600 md:text-base">
        The requested product could not be resolved from WordPress.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
      >
        Back to home
      </Link>
    </section>
  );
}

