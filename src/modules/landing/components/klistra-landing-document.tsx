import type { CSSProperties } from 'react'
import Link from 'next/link'

import type { ILandingLocale, ILandingStrings } from '@/modules/landing/landing-i18n'
import { LANDING_I18N, LANDING_LOCALES } from '@/modules/landing/landing-i18n'
import { LANDING_SIGN_IN_HREF } from '@/modules/landing/landing-sign-in-href'

import { GoogleGIcon } from '@/common/components/google-g-icon'

import { LandingFeatureLockDot } from './landing-feature-lock-dot'
import { LandingHeroDemo } from './landing-hero-demo'
import { LandingLiveDot } from './landing-live-dot'
import { LandingMotionSection } from './landing-motion-section'

export interface I_KlistraLandingDocumentProps {
  locale: ILandingLocale
}

function GoogleCtaLink({
  className,
  'data-testid': testId,
  label,
  style,
}: {
  className: string
  'data-testid'?: string
  label: string
  style?: CSSProperties
}) {
  return (
    <a className={className} href={LANDING_SIGN_IN_HREF} data-testid={testId} style={style}>
      <GoogleGIcon />
      <span>{label}</span>
    </a>
  )
}

export function KlistraLandingDocument({ locale }: I_KlistraLandingDocumentProps) {
  const t: ILandingStrings = LANDING_I18N[locale]

  return (
    <div data-klistra-landing lang={locale}>
      <header className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="#top">
            <span className="brand__mark" />
            <span className="brand__name">klistra</span>
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="#how">{t.nav_how}</a>
            <a href="#features">{t.nav_features}</a>
            <a href="#cases">{t.nav_cases}</a>
          </nav>
          <div className="header-right">
            <div className="lang-toggle" role="group" aria-label="Language">
              {LANDING_LOCALES.map((loc) => (
                <Link
                  key={loc}
                  href={`/${loc}`}
                  aria-current={locale === loc ? 'page' : undefined}
                  scroll={false}
                >
                  {loc === 'en' ? 'EN' : 'SV'}
                </Link>
              ))}
            </div>
            <GoogleCtaLink className="gbtn gbtn--sm" label={t.cta_primary} />
          </div>
        </div>
      </header>

      <LandingMotionSection className="hero" id="top">
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="eyebrow">{t.hero_eyebrow}</span>
            <h1 id="hero-heading">
              <span>
                {t.hero_h1_a}
                <em>{t.hero_h1_em}</em>
                {t.hero_h1_b}
              </span>
            </h1>
            <p className="lede">{t.hero_lede}</p>
            <div className="hero__ctas">
              <GoogleCtaLink
                className="gbtn gbtn--lg"
                data-testid="landing-primary-cta"
                label={t.cta_primary}
              />
              <a className="btn btn--ghost btn--lg" href="#how">
                {t.cta_secondary}
              </a>
            </div>
            <div className="hero__meta">
              <span>
                <LandingLiveDot />
                <span>{t.meta_realtime}</span>
              </span>
              <span>{t.meta_offline}</span>
              <span>{t.meta_versioned}</span>
            </div>
          </div>
          <div className="hero__demo">
            <LandingHeroDemo />
          </div>
        </div>
      </LandingMotionSection>

      <LandingMotionSection className="section section--alt" id="how">
        <div className="wrap">
          <div className="section__head">
            <span className="section__eyebrow">{t.how_eyebrow}</span>
            <h2>
              <span>
                {t.how_h2_a}
                <em>{t.how_h2_em}</em>
                {t.how_h2_b}
              </span>
            </h2>
            <p className="section__sub">{t.how_sub}</p>
          </div>

          <div className="how">
            <div className="how__copy">
              <h3>{t.how_copy_h}</h3>
              <p>{t.how_copy_p}</p>
              <ul className="how__list">
                <li>
                  <span className="badge">CRDT</span>
                  <div>
                    <strong>{t.how_li1_t}</strong>
                    <span>{t.how_li1_d}</span>
                  </div>
                </li>
                <li>
                  <span className="badge">P2P</span>
                  <div>
                    <strong>{t.how_li2_t}</strong>
                    <span>{t.how_li2_d}</span>
                  </div>
                </li>
                <li>
                  <span className="badge">CLOUD</span>
                  <div>
                    <strong>{t.how_li3_t}</strong>
                    <span>{t.how_li3_d}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="flow" aria-label="Sync hierarchy">
              <div className="flow__title">{t.flow_title}</div>

              <div className="flow__row">
                <span className="flow__num">01</span>
                <div className="flow__label">
                  <span>{t.flow_1_t}</span>
                  <span className="small">in-memory · ~0 ms</span>
                </div>
                <span className="flow__pill flow__pill--sync">{t.flow_sync}</span>
              </div>

              <div className="flow__row">
                <span className="flow__num">02</span>
                <div className="flow__label">
                  <span>{t.flow_2_t}</span>
                  <span className="small">survives refresh, no network</span>
                </div>
                <span className="flow__pill flow__pill--sync">{t.flow_sync}</span>
              </div>

              <div className="flow__row">
                <span className="flow__num">03</span>
                <div className="flow__label">
                  <span>{t.flow_3_t}</span>
                  <span className="small">connected peers · &lt; 100 ms typical</span>
                </div>
                <span className="flow__pill flow__pill--async">{t.flow_async}</span>
              </div>

              <div className="flow__row">
                <span className="flow__num">04</span>
                <div className="flow__label">
                  <span>{t.flow_4_t}</span>
                  <span className="small">snapshots + changelog · debounced</span>
                </div>
                <span className="flow__pill flow__pill--async">{t.flow_async}</span>
              </div>
            </div>
          </div>
        </div>
      </LandingMotionSection>

      <LandingMotionSection className="section" id="features" aria-labelledby="features-heading">
        <div className="wrap">
          <div className="section__head">
            <span className="section__eyebrow">{t.feat_eyebrow}</span>
            <h2 id="features-heading">
              <span>
                {t.feat_h2_a}
                <em>{t.feat_h2_em}</em>
                {t.feat_h2_b}
              </span>
            </h2>
          </div>

          <div className="features">
            <article className="feature">
              <div className="feature__visual" data-visual="richtext">
                <div
                  className="vfeat-note"
                  style={{ background: 'var(--note-mist)', transform: 'rotate(-1.5deg)' }}
                >
                  <div className="vfeat-h">Sprint goals</div>
                  <div className="vfeat-b">
                    <strong>Bold ideas</strong>, <em>italic doubts</em>,{' '}
                    <span className="vfeat-code">code</span>, and{' '}
                    <span className="vfeat-link">links</span>.
                  </div>
                </div>
              </div>
              <h3>{t.feat1_t}</h3>
              <p>{t.feat1_p}</p>
            </article>

            <article className="feature">
              <div className="feature__visual" data-visual="offline">
                <div className="vfeat-offline">
                  <div className="vfeat-bar">
                    <span className="vfeat-bar-dot" />
                    <span>Offline · queued</span>
                  </div>
                  <div className="vfeat-queue">
                    <div className="vfeat-queue-row">+ note &quot;Risk&quot;</div>
                    <div className="vfeat-queue-row">edit &quot;Hypothesis&quot;</div>
                    <div className="vfeat-queue-row">move 3 notes</div>
                  </div>
                </div>
              </div>
              <h3>{t.feat2_t}</h3>
              <p>{t.feat2_p}</p>
            </article>

            <article className="feature">
              <div className="feature__visual" data-visual="history">
                <div className="vfeat-timeline">
                  <div className="vfeat-tl-row">
                    <span className="vfeat-tl-dot" />
                    <span className="vfeat-tl-time">14:32</span>
                    <span className="vfeat-tl-evt">Anna edited &quot;Hypothesis&quot;</span>
                  </div>
                  <div className="vfeat-tl-row is-snap">
                    <span className="vfeat-tl-dot is-brand" />
                    <span className="vfeat-tl-time">14:00</span>
                    <span className="vfeat-tl-evt">Snapshot · &quot;Before review&quot;</span>
                  </div>
                  <div className="vfeat-tl-row">
                    <span className="vfeat-tl-dot" />
                    <span className="vfeat-tl-time">13:48</span>
                    <span className="vfeat-tl-evt">Mikael added 3 notes</span>
                  </div>
                  <div className="vfeat-tl-row">
                    <span className="vfeat-tl-dot" />
                    <span className="vfeat-tl-time">13:20</span>
                    <span className="vfeat-tl-evt">Anna changed color</span>
                  </div>
                </div>
              </div>
              <h3>{t.feat3_t}</h3>
              <p>{t.feat3_p}</p>
            </article>

            <article className="feature">
              <div className="feature__visual" data-visual="presence">
                <div className="vfeat-presence">
                  <div
                    className="vfeat-cursor"
                    style={
                      {
                        left: '18%',
                        top: '30%',
                        '--c': 'oklch(58% 0.13 245)',
                      } as CSSProperties
                    }
                  >
                    <span className="vfeat-clabel">Anna</span>
                  </div>
                  <div
                    className="vfeat-cursor"
                    style={
                      {
                        left: '60%',
                        top: '50%',
                        '--c': 'oklch(60% 0.13 28)',
                      } as CSSProperties
                    }
                  >
                    <span className="vfeat-clabel">Mikael</span>
                  </div>
                  <div
                    className="vfeat-cursor"
                    style={
                      {
                        left: '78%',
                        top: '22%',
                        '--c': 'oklch(60% 0.13 145)',
                      } as CSSProperties
                    }
                  >
                    <span className="vfeat-clabel">Sara</span>
                  </div>
                  <div className="vfeat-locked">
                    <LandingFeatureLockDot />
                    Mikael is editing
                  </div>
                </div>
              </div>
              <h3>{t.feat4_t}</h3>
              <p>{t.feat4_p}</p>
            </article>
          </div>
        </div>
      </LandingMotionSection>

      <LandingMotionSection className="section section--alt" id="cases">
        <div className="wrap">
          <div className="section__head">
            <span className="section__eyebrow">{t.cases_eyebrow}</span>
            <h2>
              <span>
                {t.cases_h2_a}
                <em>{t.cases_h2_em}</em>
                {t.cases_h2_b}
              </span>
            </h2>
          </div>

          <div className="cases">
            <article className="case">
              <div className="case__num">01 / WORKSHOPS</div>
              <h3>{t.case1_t}</h3>
              <p>{t.case1_p}</p>
              <div className="case__notes">
                <div
                  className="note"
                  style={{
                    left: 0,
                    top: 0,
                    width: '60%',
                    background: 'var(--note-cream)',
                    transform: 'rotate(-2deg)',
                  }}
                >
                  <div className="note__h">Customer voice</div>
                  <div className="note__b" style={{ fontStyle: 'italic' }}>
                    &quot;We keep losing context between rooms.&quot;
                  </div>
                </div>
                <div
                  className="note"
                  style={{
                    right: 0,
                    top: 18,
                    width: '50%',
                    background: 'var(--note-mist)',
                    transform: 'rotate(2deg)',
                  }}
                >
                  <div className="note__h">Reframe</div>
                </div>
              </div>
            </article>

            <article className="case">
              <div className="case__num">02 / RETROS</div>
              <h3>{t.case2_t}</h3>
              <p>{t.case2_p}</p>
              <div className="case__notes">
                <div
                  className="note"
                  style={{
                    left: 0,
                    top: 0,
                    width: '32%',
                    background: 'var(--note-sage)',
                    transform: 'rotate(-1.5deg)',
                  }}
                >
                  <div className="note__h">Kept</div>
                </div>
                <div
                  className="note"
                  style={{
                    left: '35%',
                    top: 8,
                    width: '32%',
                    background: 'var(--note-sand)',
                    transform: 'rotate(1deg)',
                  }}
                >
                  <div className="note__h">Tried</div>
                </div>
                <div
                  className="note"
                  style={{
                    right: 0,
                    top: -2,
                    width: '32%',
                    background: 'var(--note-rose)',
                    transform: 'rotate(-1deg)',
                  }}
                >
                  <div className="note__h">Stuck</div>
                </div>
              </div>
            </article>

            <article className="case">
              <div className="case__num">03 / PLANNING</div>
              <h3>{t.case3_t}</h3>
              <p>{t.case3_p}</p>
              <div className="case__notes">
                <div
                  className="note"
                  style={{
                    left: '4%',
                    top: 8,
                    width: '42%',
                    background: 'var(--note-slate)',
                    transform: 'rotate(-2deg)',
                  }}
                >
                  <div className="note__h">Theme · Onboarding</div>
                </div>
                <div
                  className="note"
                  style={{
                    right: '4%',
                    top: 0,
                    width: '42%',
                    background: 'var(--note-mist)',
                    transform: 'rotate(1.5deg)',
                  }}
                >
                  <div className="note__h">Bet · Live demos</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </LandingMotionSection>

      <LandingMotionSection className="cta-band">
        <div className="wrap">
          <h2>
            <span>
              {t.cta_h2_a}
              <em>{t.cta_h2_em}</em>
              {t.cta_h2_b}
            </span>
          </h2>
          <p>{t.cta_sub}</p>
          <GoogleCtaLink
            className="gbtn gbtn--lg"
            label={t.cta_primary}
            style={{ margin: '0 auto' }}
          />
        </div>
      </LandingMotionSection>

      <footer className="site-footer">
        <div>
          <span className="brand">
            <span className="brand__mark" />
            <span className="brand__name">klistra</span>
          </span>
          <span style={{ marginLeft: 14, color: 'var(--ink-3)' }}>© 2026 · {t.footer_built}</span>
        </div>
        <div className="links">
          <a href="#how">{t.nav_how}</a>
          <a href="#features">{t.nav_features}</a>
          <a className="footer-signin-btn" href={LANDING_SIGN_IN_HREF}>
            {t.footer_signin}
          </a>
        </div>
      </footer>
    </div>
  )
}
