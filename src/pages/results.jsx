import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Globe2,
  MessageSquareWarning,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

function Results() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <Link
                to="/analyze"
                className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
              >
                <ArrowLeft className="h-4 w-4" />
                Analyze another article
              </Link>

              <h1 className="text-3xl font-bold text-slate-900">
                Credibility Analysis
              </h1>

              <p className="mt-2 text-slate-500">
                AI-generated assessment of the submitted news article.
              </p>
            </div>

            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              New Analysis
            </Link>

          </div>

        </div>
      </section>


      {/* Main */}
      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* Article */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start gap-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <FileCheck2 className="h-5 w-5 text-slate-600" />
            </div>

            <div className="min-w-0">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Analyzed Article
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Example News Article: New Technology Announced to Improve
                Global Healthcare
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">

                <span className="flex items-center gap-1">
                  <Globe2 className="h-4 w-4" />
                  example-news.com
                </span>

                <span>•</span>

                <span>Analyzed just now</span>

              </div>

            </div>

          </div>

        </div>


        {/* Score Section */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">

          {/* Main Score */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-1">

            <div className="text-center">

              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                Credibility Score
              </p>

              <div className="mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-full border-[18px] border-emerald-100">

                <div className="text-center">

                  <p className="text-5xl font-bold text-slate-900">
                    82
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    out of 100
                  </p>

                </div>

              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Relatively Credible
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                The article shows several indicators associated with
                credible reporting, but individual claims should still
                be verified.
              </p>

            </div>

          </div>


          {/* Score Breakdown */}
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Score Breakdown
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Analysis across multiple credibility signals.
                </p>
              </div>

              <ShieldCheck className="h-7 w-7 text-blue-600" />

            </div>


            <div className="mt-8 space-y-7">

              {/* Source */}
              <ScoreRow
                icon={<Globe2 className="h-5 w-5" />}
                title="Source Credibility"
                score={18}
                max={20}
                description="Source reputation and reliability indicators."
              />

              {/* Evidence */}
              <ScoreRow
                icon={<FileCheck2 className="h-5 w-5" />}
                title="Evidence & Claims"
                score={21}
                max={25}
                description="Strength of evidence supporting factual claims."
              />

              {/* Cross Source */}
              <ScoreRow
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Cross-Source Agreement"
                score={17}
                max={20}
                description="Agreement with information from other sources."
              />

              {/* Content */}
              <ScoreRow
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Content Analysis"
                score={17}
                max={20}
                description="Consistency and credibility of article content."
              />

              {/* Manipulation */}
              <ScoreRow
                icon={<MessageSquareWarning className="h-5 w-5" />}
                title="Manipulation Signals"
                score={9}
                max={15}
                description="Language patterns associated with manipulation."
              />

            </div>

          </div>

        </div>


        {/* Confidence */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-blue-900">
                AI Analysis Confidence
              </p>

              <p className="mt-1 text-sm text-blue-700">
                Confidence in the generated credibility assessment.
              </p>

            </div>

            <div className="flex items-center gap-4">

              <div className="h-3 w-40 overflow-hidden rounded-full bg-blue-200">

                <div className="h-full w-[84%] rounded-full bg-blue-600" />

              </div>

              <span className="font-bold text-blue-900">
                84%
              </span>

            </div>

          </div>

        </div>


        {/* Detailed Analysis */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Positive Indicators */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Positive Indicators
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              <Indicator text="Source has established credibility signals." />

              <Indicator text="Article contains identifiable factual claims." />

              <Indicator text="Several claims have supporting evidence." />

              <Indicator text="Language is generally neutral and informative." />

            </div>

          </div>


          {/* Warnings */}
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>

              <h2 className="text-lg font-bold text-slate-900">
                Warnings
              </h2>

            </div>

            <div className="mt-6 space-y-4">

              <Indicator
                warning
                text="Some claims require additional verification."
              />

              <Indicator
                warning
                text="Limited independent evidence was identified."
              />

              <Indicator
                warning
                text="Certain statements use persuasive language."
              />

            </div>

          </div>

        </div>


        {/* Evidence */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Supporting Evidence
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sources identified during credibility analysis.
              </p>
            </div>

            <ExternalLink className="h-5 w-5 text-slate-400" />

          </div>


          <div className="mt-6 divide-y divide-slate-100">

            <Evidence
              title="Supporting source example"
              source="Example Source"
              description="Information related to the article's main claims."
            />

            <Evidence
              title="Independent reference"
              source="Reference Database"
              description="Additional information relevant to the analyzed claims."
            />

            <Evidence
              title="Fact-check reference"
              source="Fact Checking Source"
              description="Related verification information."
            />

          </div>

        </div>


        {/* Disclaimer */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5">

          <p className="text-center text-xs leading-5 text-slate-400">
            NewsAI provides an AI-generated credibility assessment.
            A high score does not guarantee that every statement in
            an article is factually correct. Always review the evidence
            and consult reliable sources before making important decisions.
          </p>

        </div>

      </section>

    </main>
  );
}


/* Score Row */
function ScoreRow({
  icon,
  title,
  score,
  max,
  description,
}) {
  const percentage = (score / max) * 100;

  return (
    <div>

      <div className="flex items-start justify-between gap-4">

        <div className="flex gap-3">

          <div className="mt-0.5 text-blue-600">
            {icon}
          </div>

          <div>

            <h3 className="font-semibold text-slate-900">
              {title}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {description}
            </p>

          </div>

        </div>

        <span className="whitespace-nowrap font-bold text-slate-900">
          {score}/{max}
        </span>

      </div>


      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${percentage}%` }}
        />

      </div>

    </div>
  );
}


/* Indicator */
function Indicator({ text, warning = false }) {
  return (
    <div className="flex items-start gap-3">

      {warning ? (
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
      ) : (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
      )}

      <p className="text-sm leading-6 text-slate-600">
        {text}
      </p>

    </div>
  );
}


/* Evidence */
function Evidence({
  title,
  source,
  description,
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-5">

      <div>

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs font-medium text-blue-600">
          {source}
        </p>

        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>

      </div>

      <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-400" />

    </div>
  );
}

export default Results;