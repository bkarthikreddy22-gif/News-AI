import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  FileText,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

function Analyze() {
  const [inputType, setInputType] = useState("url");
  const [newsInput, setNewsInput] = useState("");

  const navigate = useNavigate();

  const handleAnalyze = () => {
    if (!newsInput.trim()) {
      return;
    }

    // Temporary navigation.
    // Later this will call our AI backend.
    navigate("/results");
  };

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-10">

          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex items-start gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Analyze News
              </h1>

              <p className="mt-2 max-w-2xl text-slate-600">
                Submit a news article for AI-powered credibility analysis.
                Our system will evaluate multiple credibility signals.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Main */}
      <section className="mx-auto max-w-5xl px-6 py-12">

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Input Type */}
          <div className="border-b border-slate-200 p-6">

            <h2 className="text-lg font-bold text-slate-900">
              Choose input method
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Provide either a news article URL or the article text.
            </p>


            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              {/* URL */}
              <button
                onClick={() => {
                  setInputType("url");
                  setNewsInput("");
                }}
                className={`rounded-xl border p-5 text-left transition ${
                  inputType === "url"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      inputType === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <LinkIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Article URL
                    </h3>

                    <p className="text-sm text-slate-500">
                      Analyze a published article
                    </p>
                  </div>

                </div>

              </button>


              {/* Text */}
              <button
                onClick={() => {
                  setInputType("text");
                  setNewsInput("");
                }}
                className={`rounded-xl border p-5 text-left transition ${
                  inputType === "text"
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      inputType === "text"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <FileText className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Article Text
                    </h3>

                    <p className="text-sm text-slate-500">
                      Paste the news content
                    </p>
                  </div>

                </div>

              </button>

            </div>

          </div>


          {/* Input */}
          <div className="p-6">

            <label className="mb-3 block text-sm font-semibold text-slate-900">
              {inputType === "url"
                ? "News Article URL"
                : "News Article Text"}
            </label>


            {inputType === "url" ? (
              <div className="flex items-center rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">

                <LinkIcon className="mr-3 h-5 w-5 text-slate-400" />

                <input
                  type="url"
                  value={newsInput}
                  onChange={(e) => setNewsInput(e.target.value)}
                  placeholder="https://example.com/news/article"
                  className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                />

              </div>
            ) : (
              <textarea
                value={newsInput}
                onChange={(e) => setNewsInput(e.target.value)}
                rows="12"
                placeholder="Paste the complete news article here..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            )}


            <div className="mt-3 flex items-center justify-between">

              <p className="text-xs text-slate-400">
                {inputType === "url"
                  ? "Enter a publicly accessible news article URL."
                  : `${newsInput.length} characters`}
              </p>

              <p className="text-xs text-slate-400">
                Your article will be analyzed by the AI pipeline.
              </p>

            </div>


            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              disabled={!newsInput.trim()}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Analyze Credibility

              <ArrowRight className="h-5 w-5" />
            </button>

          </div>

        </div>


        {/* Analysis Signals */}
        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">

          <div className="flex gap-4">

            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-blue-600" />

            <div>

              <h3 className="font-semibold text-slate-900">
                What will be analyzed?
              </h3>

              <div className="mt-3 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">

                <div>
                  <span className="font-semibold text-slate-900">
                    Claim Extraction
                  </span>
                  <p className="mt-1">
                    Identify factual claims.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-900">
                    Source Analysis
                  </span>
                  <p className="mt-1">
                    Evaluate source credibility.
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-900">
                    Manipulation Detection
                  </span>
                  <p className="mt-1">
                    Analyze language patterns.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Analyze;