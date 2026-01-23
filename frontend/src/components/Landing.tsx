import { ShieldCheck, Stethoscope, Activity, Clock, Lock, Sparkles } from "lucide-react";

interface LandingProps {
  onLoginClick: () => void;
}

export function Landing({ onLoginClick }: LandingProps) {
  const highlights = [
    {
      title: "Smart scheduling",
      description: "Book, confirm, and hand off appointments across roles with audit-ready trails.",
      icon: Clock,
    },
    {
      title: "Clinical continuity",
      description: "Patient profiles, prescriptions, and follow-ups stay in sync for every clinician.",
      icon: Stethoscope,
    },
    {
      title: "Operational visibility",
      description: "Live system health, access controls, and detailed audit logs keep teams aligned.",
      icon: Activity,
    },
  ];

  const trust = [
    { label: "Role-based", value: "5+ roles" },
    { label: "Uptime", value: "99.9% target" },
    { label: "Security", value: "JWT + audit" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/60 via-indigo-600/40 to-slate-900" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,#38bdf8_0,transparent_25%),radial-gradient(circle_at_80%_0,#a855f7_0,transparent_20%),radial-gradient(circle_at_50%_80%,#22c55e_0,transparent_30%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20 lg:py-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
            <div className="space-y-6 lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm text-slate-100">
                <ShieldCheck className="w-4 h-4" />
                Unified care operations platform
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-white">
                HealthLink keeps your teams coordinated, compliant, and ready for every patient.
              </h1>
              <p className="text-lg text-slate-200 max-w-2xl">
                Role-based dashboards, secure audit logs, and real-time scheduling so clinicians, admins, and reception all work from the same source of truth.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onLoginClick}
                  className="px-5 py-3 rounded-lg bg-white text-slate-900 font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition"
                >
                  Log in
                </button>
                <a
                  href="#features"
                  className="px-5 py-3 rounded-lg border border-white/30 text-white hover:border-white hover:bg-white/10 transition"
                >
                  See what is inside
                </a>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                {trust.map((item) => (
                  <div
                    key={item.label}
                    className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm"
                  >
                    <div className="text-slate-200">{item.label}</div>
                    <div className="text-white font-semibold">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="relative bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur shadow-2xl">
                <div className="absolute -top-10 right-6 bg-blue-500 text-white px-3 py-2 rounded-full text-sm shadow-lg shadow-blue-500/40 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Live status: Healthy
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-white font-semibold">Today</div>
                    <div className="text-xs text-slate-200">Audited & secure</div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Appointments", value: "128" },
                      { label: "Follow-ups", value: "34" },
                      { label: "Messages", value: "76" },
                    ].map((card) => (
                      <div key={card.label} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-slate-200 text-sm">{card.label}</div>
                        <div className="text-white text-2xl font-semibold">{card.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2 text-slate-200 text-sm">
                      <Lock className="w-4 h-4" /> Recent audit log
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between text-white">
                        <span>Admin updated Dr. Patel</span>
                        <span className="text-slate-300">12:04</span>
                      </div>
                      <div className="flex items-center justify-between text-white">
                        <span>Prescription synced to pharmacy</span>
                        <span className="text-slate-300">11:42</span>
                      </div>
                      <div className="flex items-center justify-between text-white">
                        <span>New patient record created</span>
                        <span className="text-slate-300">11:15</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className="max-w-6xl mx-auto px-6 py-16 space-y-12">
        <div className="space-y-2">
          <p className="text-blue-400 font-semibold">Capabilities</p>
          <h2 className="text-3xl font-semibold text-white">Everything teams need to run care operations</h2>
          <p className="text-slate-300 max-w-3xl">
            Purpose-built dashboards for admins, clinicians, nurses, and reception. Scheduling, prescriptions, and audit trails stay aligned in one platform.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur">
              <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-200 flex items-center justify-center mb-4">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl text-white font-semibold mb-2">{item.title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Landing;
