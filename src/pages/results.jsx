import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const analysis = location.state?.analysis;

  // If someone opens /results directly without analyzing an article
  if (!analysis) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-500" />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            No Analysis Found
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Please submit a news article from the Analyze page first.
          </p>

          <Link
            to="/analyze"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Analyze an Article
          </Link>
        </div>
      </main>
    );
  }

  const score = analysis.credibility_score ?? 0;
  const confidence = analysis.confidence ?? 0;

  const breakdown = analysis.score_breakdown ?? {};

  const claims = analysis.claims ?? [];
  const positiveIndicators = analysis.positive_indicators ?? [];
  const warnings = analysis.warnings ?? [];

  const source = analysis.source ?? {};
  const verification = analysis.verification ?? {};

  const article = analysis.article ?? "";

  const scoreColor =
    score >= 80
      ? "emerald"
      : score >= 60
      ? "blue"
      : score >= 40
      ? "amber"
      : "red";

  const scoreLabel = analysis.label ?? "Analysis completed";

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

              <h2 className="mt-1 text-lg font-bold text-slate-900 break-words">
                {article.length > 180
                  ? `${article.substring(0, 180)}...`
                  : article}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">

                <span className="flex items-center gap-1">
                  <Globe2 className="h-4 w-4" />

                  {source.domain || "Source not provided"}
                </span>

                <span>•</span>

                <span>
                  Analysis completed
                </span>

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

              <div
                className={`mx-auto mt-6 flex h-48 w-48 items-center justify-center rounded-full border-[18px] ${
                  scoreColor === "emerald"
                    ? "border-emerald-100"
                    : scoreColor === "blue"
                    ? "border-blue-100"
                    : scoreColor === "amber"
                    ? "border-amber-100"
                    : "border-red-100"
                }`}
              >

                <div className="text-center">

                  <p className="text-5xl font-bold text-slate-900">
                    {score}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    out of 100
                  </p>

                </div>

              </div>

              <div
                className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  score >= 80
                    ? "bg-emerald-50 text-emerald-700"
                    : score >= 60
                    ? "bg-blue-50 text-blue-700"
                    : score >= 40
                    ? "bg-amber-50 text-amber-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {score >= 60 ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}

                {scoreLabel}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-500">
                This score represents the baseline credibility signals
                detected by the current NewsAI analysis engine. Individual
                claims should still be independently verified.
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

              <ScoreRow
                icon={<Globe2 className="h-5 w-5" />}
                title="Source Credibility"
                score={breakdown.source_credibility?.score ?? 0}
                max={breakdown.source_credibility?.max_score ?? 20}
                description={
                  source.description ||
                  "Source reputation and reliability indicators."
                }
              />


              <ScoreRow
                icon={<FileCheck2 className="h-5 w-5" />}
                title="Evidence & Claims"
                score={breakdown.evidence_claims?.score ?? 0}
                max={breakdown.evidence_claims?.max_score ?? 25}
                description="Strength of evidence-related indicators."
              />


              <ScoreRow
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Cross-Source Agreement"
                score={breakdown.cross_source_agreement?.score ?? 0}
                max={breakdown.cross_source_agreement?.max_score ?? 20}
                description={
                  verification.message ||
                  "Agreement with information from other sources."
                }
              />


              <ScoreRow
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Content Analysis"
                score={breakdown.content_analysis?.score ?? 0}
                max={breakdown.content_analysis?.max_score ?? 20}
                description="Analysis of article content and available context."
              />


              <ScoreRow
                icon={<MessageSquareWarning className="h-5 w-5" />}
                title="Manipulation Signals"
                score={breakdown.manipulation_signals?.score ?? 0}
                max={breakdown.manipulation_signals?.max_score ?? 15}
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

                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{ width: `${confidence}%` }}
                />

              </div>

              <span className="font-bold text-blue-900">
                {confidence}%
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

              {positiveIndicators.length > 0 ? (
                positiveIndicators.map((indicator, index) => (
                  <Indicator
                    key={index}
                    text={indicator}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No positive indicators were detected.
                </p>
              )}

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

              {warnings.length > 0 ? (
                warnings.map((warning, index) => (
                  <Indicator
                    key={index}
                    warning
                    text={warning}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No warnings were detected.
                </p>
              )}

            </div>

          </div>

        </div>


        {/* Claims */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Extracted Claims
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Candidate factual claims identified by the analysis engine.
              </p>

            </div>

            <FileCheck2 className="h-5 w-5 text-slate-400" />

          </div>


          <div className="mt-6 divide-y divide-slate-100">

            {claims.length > 0 ? (
              claims.map((claim, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 py-5"
                >

                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>

                  <div>

                    <p className="text-sm leading-6 text-slate-700">
                      {claim.text}
                    </p>

                    <span className="mt-2 inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      {claim.status}
                    </span>

                  </div>

                </div>
              ))
            ) : (
              <p className="py-5 text-sm text-slate-500">
                No clear factual claims were extracted.
              </p>
            )}

          </div>

        </div>


        {/* Verification */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Verification Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current status of external verification.
              </p>

            </div>

            <ShieldCheck className="h-5 w-5 text-slate-400" />

          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-5">

            <p className="text-sm font-semibold text-slate-900">
              {verification.cross_source_status ||
                "Verification not available"}
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {verification.message ||
                "No external verification information is available yet."}
            </p>

          </div>

        </div>


        {/* Supporting Evidence */}
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


          <div className="mt-6">

            {source.domain ? (
              <Evidence
                title="Detected Source"
                source={source.domain}
                description={source.description}
              />
            ) : (
              <div className="rounded-xl bg-slate-50 p-5">

                <p className="text-sm font-semibold text-slate-700">
                  No source URL detected
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Provide an article URL in future analyses to allow
                  source-level analysis.
                </p>

              </div>
            )}

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


/* ============================================================
   Score Row
============================================================ */

function ScoreRow({
  icon,
  title,
  score,
  max,
  description,
}) {

  const percentage =
    max > 0
      ? Math.min((score / max) * 100, 100)
      : 0;

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


/* ============================================================
   Indicator
============================================================ */

function Indicator({
  text,
  warning = false,
}) {

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


/* ============================================================
   Evidence
============================================================ */

function Evidence({
  title,
  source,
  description,
}) {

  return (
    <div className="flex items-start justify-between gap-5 rounded-xl bg-slate-50 p-5">

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