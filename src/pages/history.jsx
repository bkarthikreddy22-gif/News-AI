import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

const analyses = [
  {
    title: "New Technology Announced to Improve Global Healthcare",
    source: "example-news.com",
    score: 82,
    status: "Relatively Credible",
    date: "Today, 4:12 PM",
  },
  {
    title: "Scientists Discover Major Breakthrough in Renewable Energy",
    source: "news-example.com",
    score: 74,
    status: "Moderately Credible",
    date: "Today, 2:35 PM",
  },
  {
    title: "Viral Social Media Claim About New Government Policy",
    source: "social-example.com",
    score: 41,
    status: "Needs Verification",
    date: "Yesterday, 7:48 PM",
  },
];

function History() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                Your Activity
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Analysis History
              </h1>

              <p className="mt-2 text-slate-500">
                Review previously analyzed news articles and their
                credibility assessments.
              </p>
            </div>

            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              Analyze News
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>
      </section>


      {/* Content */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">

            <Search className="mr-3 h-5 w-5 text-slate-400" />

            <input
              type="text"
              placeholder="Search analyzed articles..."
              className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />

          </div>

        </div>


        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">

          <SummaryCard
            label="Total Analyses"
            value="12"
            icon={<FileText className="h-5 w-5" />}
          />

          <SummaryCard
            label="Average Score"
            value="71"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <SummaryCard
            label="Last Analysis"
            value="Today"
            icon={<Clock3 className="h-5 w-5" />}
          />

        </div>


        {/* History List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-6 py-5">

            <h2 className="font-bold text-slate-900">
              Recent Analyses
            </h2>

          </div>


          <div className="divide-y divide-slate-100">

            {analyses.map((article, index) => (
              <HistoryItem
                key={index}
                {...article}
              />
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}


function SummaryCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>

      </div>

      <p className="mt-5 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
}


function HistoryItem({
  title,
  source,
  score,
  status,
  date,
}) {
  const scoreColor =
    score >= 75
      ? "text-emerald-600 bg-emerald-50"
      : score >= 50
      ? "text-amber-600 bg-amber-50"
      : "text-red-600 bg-red-50";

  return (
    <div className="flex flex-col gap-5 px-6 py-6 transition hover:bg-slate-50 md:flex-row md:items-center md:justify-between">

      <div className="min-w-0">

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">

          <span className="flex items-center gap-1">
            <ExternalLink className="h-3.5 w-3.5" />
            {source}
          </span>

          <span>•</span>

          <span>{date}</span>

        </div>

      </div>


      <div className="flex shrink-0 items-center gap-4">

        <div className="text-right">

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${scoreColor}`}
          >
            {status}
          </span>

          <p className="mt-1 text-sm text-slate-400">
            Credibility score
          </p>

        </div>


        <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-slate-100">

          <span className="font-bold text-slate-900">
            {score}
          </span>

        </div>

      </div>

    </div>
  );
}

export default History;