import { useEffect, useMemo, useRef, useState } from 'react';
import viteLogo from '@/assets/vite.svg';
import reactLogo from '@/assets/react.svg';
import tailwind from '@/assets/tailwind.svg';

type ThemeName = 'light' | 'dark' | 'brand' | 'mint';
const STORAGE_KEY = 'storage-theme';

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  const themes = useMemo<ThemeName[]>(
    () => ['light', 'dark', 'brand', 'mint'],
    [],
  );

  // Prefer saved theme; otherwise follow system for first load.
  const getInitialTheme = (): ThemeName => {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved && themes.includes(saved)) return saved;
    const prefersDark =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Keyboard: ArrowLeft / ArrowRight to switch themes.
  const onKeyNav: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = themes.indexOf(theme);
    const next =
      e.key === 'ArrowRight'
        ? themes[(i + 1) % themes.length]
        : themes[(i - 1 + themes.length) % themes.length];
    setTheme(next);
  };

  return (
    <main className="min-h-dvh">
      {/* HERO with section-scoped theming */}
      <section
        ref={heroRef}
        data-theme={theme}
        className="relative flex min-h-[100dvh] items-center overflow-hidden bg-background"
      >
        {/* Fixed Theme Switcher Dock (safe-area aware) */}
        <div
          className="fixed z-50"
          style={{
            insetInlineEnd: 'max(1rem, env(safe-area-inset-right))',
            insetBlockStart: 'max(1rem, env(safe-area-inset-top))',
          }}
        >
          <div
            role="tablist"
            aria-label="Theme switcher"
            onKeyDown={onKeyNav}
            className="inline-flex rounded-full bg-secondary/70 p-1 shadow-soft ring-1 ring-border backdrop-blur"
          >
            {themes.map((t) => {
              const active = theme === t;
              return (
                <button
                  key={t}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTheme(t)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none',
                    active
                      ? 'bg-primary text-primary-foreground shadow-soft'
                      : 'text-muted-foreground hover:text-foreground',
                  ].join(' ')}
                  title={`Theme: ${t}`}
                >
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Layer 1: soft color gradients */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 60% at 75% 25%, hsl(var(--accent) / 0.25) 0%, transparent 60%), radial-gradient(45% 45% at 20% 80%, hsl(var(--primary) / 0.18) 0%, transparent 60%)',
          }}
        />
        {/* Layer 2: subtle grid */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-25 mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent 0 22px, hsl(var(--border)) 22px 23px), repeating-linear-gradient(90deg, transparent 0 22px, hsl(var(--border)) 22px 23px)',
          }}
        />
        {/* Layer 3: vignette */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 80%, transparent 40%, hsl(var(--background)) 100%)',
          }}
        />

        <div className="container relative grid grid-cols-1 items-center gap-12 py-20 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left content */}
          <div className="space-y-7">
            <span className="badge">Section-scoped theming</span>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-muted-foreground sm:text-5xl">
              <span className="bg-gradient-to-tr from-accent to-primary bg-clip-text text-transparent">
                Build beautiful UIs faster.
              </span>{' '}
              Switch the theme for just this section.
            </h1>

            <p className="max-w-prose text-lg text-muted-foreground">
              The entire background and components react to the selected theme.
              Try Light, Dark, Brand, or Mint. All powered by Tailwind tokens
              mapped to CSS variables.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <a href="#" className="btn btn-primary">
                Get started
              </a>
              <a href="#" className="btn btn-secondary">
                Documentation
              </a>
            </div>

            {/* Feature bullets */}
            <ul className="mt-2 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                Section-only theme switching.
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                Tokens via CSS variables.
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-accent" />
                Tailwind utilities only.
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                No recompile on toggle.
              </li>
            </ul>
          </div>

          {/* Right preview card */}
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-10 -z-10 opacity-50 blur-3xl"
              style={{
                background:
                  'radial-gradient(40% 40% at 60% 30%, hsl(var(--accent) / 0.6), transparent 60%), radial-gradient(35% 35% at 20% 70%, hsl(var(--primary) / 0.6), transparent 60%)',
              }}
            />

            <div className="rounded-2xl bg-card/80 p-4 shadow-soft ring-1 ring-border backdrop-blur">
              <div className="aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-float mr-4 rounded-2xl bg-background p-3 shadow-soft ring-1 ring-border">
                        <img
                          src={viteLogo}
                          alt="Vite logo"
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          loading="lazy"
                        />
                      </div>
                      <div className="animate-float mr-4 rounded-2xl bg-background p-3 shadow-soft ring-1 ring-border">
                        <img
                          src={reactLogo}
                          alt="React logo"
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          loading="lazy"
                        />
                      </div>
                      <div className="animate-float rounded-2xl bg-background p-3 shadow-soft ring-1 ring-border">
                        <img
                          src={tailwind}
                          alt="Tailwind logo"
                          className="h-8 w-8 sm:h-10 sm:w-10"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="mt-5 text-center text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Vite</span>{' '}
                      +{' '}
                      <span className="font-medium text-foreground">React</span>{' '}
                      +{' '}
                      <span className="font-medium text-foreground">
                        Tailwind
                      </span>{' '}
                      equals Rapid UI.
                    </div>
                    <div className="mx-auto mt-5 h-20 w-20 rounded-2xl bg-gradient-to-tr from-accent to-primary" />
                    <div className="mt-4 text-sm text-muted-foreground">
                      Themed Preview
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Color Palette
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block h-3 w-3 rounded-full bg-primary" />
                  <span className="inline-block h-3 w-3 rounded-full bg-accent" />
                  <span className="inline-block h-3 w-3 rounded-full bg-secondary" />
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-sm text-muted-foreground">
              Tip: put data-theme on any section to theme it independently.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
