
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAnalyze = async (e) => {
    e?.preventDefault();
    setError("");

    const articleContent = newsInput.trim();

    if (!articleContent) {
      setError(
        inputType === "url"
          ? "Please enter a news article URL."
          : "Please paste the news article text."
      );
      return;
    }

    if (inputType === "url") {
      let parsedUrl;

      try {
        parsedUrl = new URL(articleContent);
      } catch {
        setError("Please enter a valid article URL.");
        return;
      }

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        setError("Only HTTP and HTTPS URLs are supported.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await axios.post(
        inputType === "url"
          ? "http://127.0.0.1:8000/analyze-url"
          : "http://127.0.0.1:8000/analyze",
        inputType === "url"
          ? { url: articleContent }
          : { content: articleContent }
      );

      console.log("Backend response:", response.data);

      if (response.data?.status === "error") {
        setError(
          response.data.message || "Unable to analyze this article."
        );
        return;
      }

      navigate("/results", {
        state: {
          analysis: response.data,
          inputType,
          originalInput: articleContent,
        },
      });
    } catch (err) {
      console.error("Analysis error:", err);

      setError(
        err.response?.data?.detail ||
          "Unable to analyze the article. Check that the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
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
                Our system evaluates multiple credibility signals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-900">
              Choose input method
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Provide an article URL or paste the article text.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setInputType("url");
                  setNewsInput("");
                  setError("");
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

              <button
                type="button"
                onClick={() => {
                  setInputType("text");
                  setNewsInput("");
                  setError("");
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

          <form
            onSubmit={handleAnalyze}
            className="p-5 sm:p-6"
          >
            <label
              htmlFor="news-input"
              className="mb-3 block text-sm font-semibold text-slate-900"
            >
              {inputType === "url"
                ? "News Article URL"
                : "News Article Text"}
            </label>

            {inputType === "url" ? (
              <div className="flex min-w-0 items-center rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100">
                <LinkIcon className="mr-3 h-5 w-5 shrink-0 text-slate-400" />
                <input
                  id="news-input"
                  type="url"
                  value={newsInput}
                  onChange={(e) => {
                    setNewsInput(e.target.value);
                    setError("");
                  }}
                  placeholder="https://example.com/news/article"
                  className="w-full min-w-0 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                  autoComplete="url"
                />
              </div>
            ) : (
              <textarea
                id="news-input"
                value={newsInput}
                onChange={(e) => {
                  setNewsInput(e.target.value);
                  setError("");
                }}
                rows={12}
                placeholder="Paste the complete news article here..."
                className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            )}

            <div className="mt-3 flex flex-wrap justify-between gap-2">
              <p className="text-xs text-slate-400">
                {inputType === "url"
                  ? "Enter a publicly accessible article URL."
                  : `${newsInput.length} characters`}
              </p>
              <p className="text-xs text-slate-400">
                NewsAI evaluates credibility signals, not guaranteed truth.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!newsInput.trim() || loading}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Analyze Credibility"}
              {!loading && <ArrowRight className="h-5 w-5" />}
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-900">
                What will be analyzed?
              </h3>
              <div className="mt-3 grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
                <div>
                  <span className="font-semibold text-slate-900">
                    Claim Extraction
                  </span>
                  <p className="mt-1">Identify candidate factual claims.</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">
                    Source Analysis
                  </span>
                  <p className="mt-1">Evaluate available source signals.</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-900">
                    Manipulation Detection
                  </span>
                  <p className="mt-1">Analyze potentially sensational language.</p>
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
