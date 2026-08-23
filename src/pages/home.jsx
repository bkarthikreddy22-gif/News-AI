import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Search,
  FileCheck2,
  Brain,
  BarChart3,
} from "lucide-react";

function Home() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-20">
        <div className="mx-auto max-w-4xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
            <ShieldCheck className="h-4 w-4" />
            AI-Powered News Credibility Analysis
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
            Don't Just Read the News.
            <span className="block text-blue-600">
              Know What to Trust.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Analyze news articles using AI-powered claim analysis,
            source credibility checks, evidence verification, and
            manipulation detection.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800"
            >
              Analyze News
              <ArrowRight className="h-5 w-5" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              How It Works
            </a>

          </div>
        </div>
      </section>


      {/* Analysis Input Preview */}
      <section className="mx-auto max-w-5xl px-6 pb-24">

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 md:p-8">

          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Analyze a News Article
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Paste a URL or article text to begin.
              </p>
            </div>

            <Search className="hidden h-6 w-6 text-slate-400 sm:block" />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

            <textarea
              rows="5"
              placeholder="Paste a news article URL or article text here..."
              className="w-full resize-none bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
            />

          </div>

          <div className="mt-4 flex justify-end">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Start Analysis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

        </div>

      </section>


      {/* How It Works */}
      <section
        id="how-it-works"
        className="border-y border-slate-200 bg-white py-20"
      >

        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              Multiple signals. One credibility assessment.
            </h2>

            <p className="mt-4 text-slate-600">
              NewsAI analyzes different aspects of an article before
              producing its final credibility assessment.
            </p>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {/* Claim Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <FileCheck2 className="h-6 w-6 text-blue-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Claim Analysis
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Identify factual claims within the news article for
                further analysis and verification.
              </p>

            </div>


            {/* Source Analysis */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Source & Language Analysis
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Examine source credibility and language patterns that
                may indicate manipulation.
              </p>

            </div>


            {/* Score */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                <BarChart3 className="h-6 w-6 text-emerald-600" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Credibility Score
              </h3>

              <p className="mt-2 leading-7 text-slate-600">
                Combine multiple analysis signals into a structured
                credibility assessment.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Bottom CTA */}
      <section className="bg-slate-900 py-20">

        <div className="mx-auto max-w-4xl px-6 text-center">

          <ShieldCheck className="mx-auto h-12 w-12 text-blue-400" />

          <h2 className="mt-6 text-3xl font-bold text-white">
            Make more informed decisions.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Analyze news through multiple credibility signals instead
            of relying on a simple real-or-fake classification.
          </p>

          <Link
            to="/analyze"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            Analyze a News Article
            <ArrowRight className="h-5 w-5" />
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Home;