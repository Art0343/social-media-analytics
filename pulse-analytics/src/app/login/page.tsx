export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-surface dark:bg-[#0a0f1c]">
      {/* Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] rounded-full bg-primary/5 dark:bg-[#1e3a5f]/20 blur-[120px]" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30rem] h-[30rem] rounded-full bg-secondary-container/20 dark:bg-[#0f2d4a]/30 blur-[100px]" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/10 mb-6 hover:scale-105 transition-transform duration-300">
            <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-on-surface mb-2">Pulse Analytics</h1>
          <p className="text-on-surface-variant font-medium max-w-[280px] leading-relaxed">
            Social analytics built for performance-driven teams
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-container-high dark:bg-[#111827] rounded-2xl shadow-2xl dark:shadow-black/50 p-8 border border-outline-variant/20 dark:border-[#1e293b]">
          <div className="space-y-6">
            {/* Google Sign-in */}
            <button className="w-full flex items-center justify-center gap-3 bg-white text-on-surface font-semibold py-3.5 px-6 rounded-lg border border-outline-variant/30 hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-[1px] flex-1 bg-outline-variant/20" />
              <span className="text-outline text-xs font-bold uppercase tracking-widest">Authorized Access</span>
              <div className="h-[1px] flex-1 bg-outline-variant/20" />
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-secondary tracking-wide ml-1">Workspace Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  disabled
                  className="w-full bg-surface-container-low dark:bg-[#1e293b] border border-outline-variant/30 dark:border-[#334155] rounded-lg px-4 py-3.5 text-sm text-on-surface dark:text-white focus:ring-2 focus:ring-primary/50 dark:focus:ring-[#3b82f6]/50 transition-all outline-none placeholder:text-outline/60 dark:placeholder:text-gray-500"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <span className="material-symbols-outlined text-outline/40 text-lg">lock</span>
                </div>
              </div>
            </div>

            <button className="w-full bg-primary dark:bg-gradient-to-r dark:from-[#3b82f6] dark:to-[#60a5fa] text-white font-bold py-4 px-6 rounded-lg shadow-lg shadow-primary/20 dark:shadow-blue-500/25 opacity-50 cursor-not-allowed">
              Continue to Dashboard
            </button>
          </div>

          {/* Invite Info */}
          <div className="mt-8 pt-8 border-t border-outline-variant/10 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5">info</span>
            <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
              Access restricted to invited users only. Contact your organization administrator to request access to the Pulse platform.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-10 flex justify-center gap-8">
          <a href="#" className="text-xs font-bold text-secondary hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="text-xs font-bold text-secondary hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="text-xs font-bold text-secondary hover:text-primary transition-colors">Help Center</a>
        </div>

        {/* Floating Chips */}
        <div className="absolute -right-16 top-1/4 hidden lg:block">
          <div className="bg-surface-container-high/90 dark:bg-[#1e293b] backdrop-blur-md rounded-xl p-4 shadow-xl border border-surface-container-high/50 dark:border-[#334155] flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-tertiary/10 dark:bg-[#3b82f6]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary dark:text-[#60a5fa]">trending_up</span>
            </div>
            <div>
              <div className="text-[10px] font-bold text-outline dark:text-gray-400 uppercase tracking-wider">Top Insight</div>
              <div className="text-sm font-bold text-on-surface dark:text-white">Reach up +12.4%</div>
            </div>
          </div>
        </div>
        <div className="absolute -left-20 bottom-1/4 hidden lg:block">
          <div className="bg-surface-container-high/90 dark:bg-[#1e293b] backdrop-blur-md rounded-xl p-4 shadow-xl border border-surface-container-high/50 dark:border-[#334155] flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">bolt</span>
            </div>
            <div>
              <div className="text-[10px] font-bold text-outline uppercase tracking-wider">Performance</div>
              <div className="text-sm font-bold text-on-surface">AI Insights Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-6 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] text-on-surface-variant/40 font-medium tracking-[0.2em] uppercase">
          © Pulse Analytics System 2026
        </span>
      </footer>
    </main>
  );
}
