import {
  Brain,
  CheckCircle2,
  ShieldCheck,
  Target,
} from "lucide-react";

function About() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Hero */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">
            <ShieldCheck className="h-7 w-7 text-blue-600" />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            About NewsAI
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            NewsAI is designed to provide a structured assessment of
            news credibility by analyzing multiple signals rather than
            relying on a simple real-or-fake classification.
          </p>

        </div>
      </section>


      {/* Mission */}
      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-6 md:grid-cols-3">

          <InfoCard
            icon={<Target className="h-6 w-6" />}
            title="Our Goal"
            text="Help users evaluate news more carefully by presenting an understandable credibility assessment."
          />

          <InfoCard
            icon={<Brain className="h-6 w-6" />}
            title="AI-Powered"
            text="Use NLP and machine-learning techniques to analyze news content and credibility signals."
          />

          <InfoCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="Evidence-Based"
            text="Present supporting information and analysis signals alongside the final assessment."
          />

        </div>


        {/* Methodology */}
        <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            How NewsAI Evaluates News
          </h2>

          <p className="mt-4 leading-7 text-slate-600">
            The system is designed around multiple analysis stages,
            including claim extraction, source credibility analysis,
            language and manipulation detection, and a scoring stage
            that combines the available signals into a structured
            credibility assessment.
          </p>


          <div className="mt-8 space-y-5">

            <MethodStep
              number="01"
              title="News Processing"
              text="The submitted article is processed and prepared for analysis."
            />

            <MethodStep
              number="02"
              title="Claim Analysis"
              text="Important factual claims are identified from the article."
            />

            <MethodStep
              number="03"
              title="Source Analysis"
              text="The credibility and characteristics of the source are considered."
            />

            <MethodStep
              number="04"
              title="Manipulation Analysis"
              text="Language patterns and potential manipulation indicators are analyzed."
            />

            <MethodStep
              number="05"
              title="Credibility Assessment"
              text="The analysis signals are combined into a structured credibility report."
            />

          </div>

        </div>


        {/* Disclaimer */}
        <div className="mx-auto mt-8 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 p-5">

          <p className="text-sm leading-6 text-amber-800">
            NewsAI is an analytical tool. A credibility score should not
            be treated as absolute proof that an article is true or false.
            Users should review the underlying evidence and sources.
          </p>

        </div>

      </section>

    </main>
  );
}


function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 leading-7 text-slate-600">
        {text}
      </p>

    </div>
  );
}


function MethodStep({ number, title, text }) {
  return (
    <div className="flex gap-5">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
        {number}
      </div>

      <div>
        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>

    </div>
  );
}

export default About;