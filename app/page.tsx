export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-8 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">AI Software Factory</span>
          </div>
          <nav className="hidden gap-6 text-sm text-zinc-400 sm:flex">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-white">How it works</a>
            <a href="#get-started" className="transition-colors hover:text-white">Get started</a>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="flex flex-col items-center justify-center px-8 py-32 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            Powered by AI
          </div>
          <h1 className="mb-6 max-w-3xl text-5xl font-bold tracking-tight text-white">
            Build software faster with your{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI-powered factory
            </span>
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-zinc-400">
            Automate repetitive tasks, generate boilerplate code, and ship
            production-ready software at unprecedented speed.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="#get-started"
              className="rounded-full bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Get started free
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-zinc-700 px-7 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
            >
              See how it works
            </a>
          </div>
        </section>

        <section id="features" className="border-t border-zinc-800 px-8 py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-white">Everything you need to ship faster</h2>
            <p className="mb-16 text-center text-zinc-400">A full suite of AI-powered tools built for modern development teams.</p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: "⚡",
                  title: "Code Generation",
                  desc: "Generate production-ready code from plain-English descriptions in seconds.",
                },
                {
                  icon: "🔍",
                  title: "Smart Code Review",
                  desc: "Catch bugs, security issues, and style violations before they reach production.",
                },
                {
                  icon: "🧪",
                  title: "Test Automation",
                  desc: "Auto-generate comprehensive test suites for any codebase.",
                },
                {
                  icon: "📄",
                  title: "Documentation",
                  desc: "Keep docs up-to-date automatically as your codebase evolves.",
                },
                {
                  icon: "🔄",
                  title: "Refactoring Assistant",
                  desc: "Safely modernize legacy code with AI-guided refactoring suggestions.",
                },
                {
                  icon: "🚀",
                  title: "CI/CD Integration",
                  desc: "Plug into your existing pipeline with zero friction.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700"
                >
                  <div className="mb-4 text-3xl">{f.icon}</div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-zinc-800 px-8 py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">How it works</h2>
            <p className="mb-16 text-zinc-400">Three simple steps to supercharge your development workflow.</p>
            <div className="grid gap-8 text-left sm:grid-cols-3">
              {[
                { step: "01", title: "Connect your repo", desc: "Link your GitHub, GitLab, or Bitbucket repository in one click." },
                { step: "02", title: "Configure your stack", desc: "Tell the factory about your tech stack and coding standards." },
                { step: "03", title: "Ship with AI", desc: "Let AI handle the heavy lifting while you focus on what matters." },
              ].map((s) => (
                <div key={s.step} className="flex flex-col gap-3">
                  <div className="text-5xl font-bold text-zinc-800">{s.step}</div>
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="get-started" className="border-t border-zinc-800 px-8 py-24">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white">Ready to build smarter?</h2>
            <p className="mb-8 text-zinc-400">Join thousands of developers shipping faster with the AI Software Factory.</p>
            <form className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-zinc-700 bg-zinc-900 px-5 py-3 text-sm text-white placeholder-zinc-500 outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Get early access
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-8 py-8 text-center text-sm text-zinc-600">
        © {new Date().getFullYear()} AI Software Factory. All rights reserved.
      </footer>
    </div>
  );
}
