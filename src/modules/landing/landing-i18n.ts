import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
} from '@/common/content/site-default-metadata'

export const LANDING_LOCALES = ['en', 'sv'] as const
export type ILandingLocale = (typeof LANDING_LOCALES)[number]

export const LANDING_DEFAULT_LOCALE: ILandingLocale = 'en'

export function isLandingLocale(value: string): value is ILandingLocale {
  return (LANDING_LOCALES as readonly string[]).includes(value)
}

/** `<title>` and meta description for `app/[locale]` (design-aligned English title from `Landing Page.html`). */
export interface ILandingPageSeo {
  title: string
  description: string
}

export const LANDING_PAGE_SEO: Record<ILandingLocale, ILandingPageSeo> = {
  en: {
    title: SITE_DEFAULT_TITLE,
    description: SITE_DEFAULT_DESCRIPTION,
  },
  sv: {
    title: 'Klistra — tänk tillsammans, online eller offline',
    description:
      'Klistra håller allas lappar i samma rum — rik text, livecursor och historik du kan spola. Fungerar även när wifi inte gör det.',
  },
}

/** Strings mirrored from `design/Landing Page.html` I18N. */
export interface ILandingStrings {
  nav_how: string
  nav_features: string
  nav_cases: string
  cta_primary: string
  cta_secondary: string
  hero_eyebrow: string
  hero_h1_a: string
  hero_h1_em: string
  hero_h1_b: string
  hero_lede: string
  meta_realtime: string
  meta_offline: string
  meta_versioned: string
  how_eyebrow: string
  how_h2_a: string
  how_h2_em: string
  how_h2_b: string
  how_sub: string
  how_copy_h: string
  how_copy_p: string
  how_li1_t: string
  how_li1_d: string
  how_li2_t: string
  how_li2_d: string
  how_li3_t: string
  how_li3_d: string
  flow_title: string
  flow_1_t: string
  flow_2_t: string
  flow_3_t: string
  flow_4_t: string
  flow_sync: string
  flow_async: string
  feat_eyebrow: string
  feat_h2_a: string
  feat_h2_em: string
  feat_h2_b: string
  feat1_t: string
  feat1_p: string
  feat2_t: string
  feat2_p: string
  feat3_t: string
  feat3_p: string
  feat4_t: string
  feat4_p: string
  cases_eyebrow: string
  cases_h2_a: string
  cases_h2_em: string
  cases_h2_b: string
  case1_t: string
  case1_p: string
  case2_t: string
  case2_p: string
  case3_t: string
  case3_p: string
  cta_h2_a: string
  cta_h2_em: string
  cta_h2_b: string
  cta_sub: string
  footer_built: string
  footer_signin: string
}

export const LANDING_I18N: Record<ILandingLocale, ILandingStrings> = {
  en: {
    nav_how: 'How it works',
    nav_features: 'Features',
    nav_cases: 'Use cases',
    cta_primary: 'Continue with Google',
    cta_secondary: 'See how it works',
    hero_eyebrow: 'A canvas for thinking together',
    hero_h1_a: 'A sticky-note canvas you ',
    hero_h1_em: 'never lose',
    hero_h1_b: '.',
    hero_lede:
      "Klistra keeps everyone's notes in one room — with rich text, peer cursors, and a history you can rewind. Edits keep working when the wifi doesn't.",
    meta_realtime: 'Real-time, peer-to-peer',
    meta_offline: 'Offline-first',
    meta_versioned: 'Versioned',
    how_eyebrow: 'How it works',
    how_h2_a: 'Your edits land in ',
    how_h2_em: 'four places',
    how_h2_b: ', in order.',
    how_sub:
      "The first two are instant. The last two happen in the background, so the canvas never waits on the network. That's why typing feels the same online and off.",
    how_copy_h: 'A write is "done" the moment your screen updates.',
    how_copy_p:
      "Real-time sync between people stays peer-to-peer. The cloud is for persistence, history, and joining a room you've never opened before — not the keystroke path.",
    how_li1_t: 'Conflict-free by construction',
    how_li1_d: 'Concurrent edits converge — no merge UI, no lost characters.',
    how_li2_t: 'Peer-to-peer real-time',
    how_li2_d: 'WebRTC moves your edits between teammates directly.',
    how_li3_t: 'Cloud as memory, not bottleneck',
    how_li3_d: 'Snapshots and a structured changelog flow to Firestore in the background.',
    flow_title: 'Sync hierarchy · per write',
    flow_1_t: 'Yjs document',
    flow_2_t: 'y-indexeddb',
    flow_3_t: 'y-webrtc',
    flow_4_t: 'Firestore',
    flow_sync: 'sync',
    flow_async: 'async',
    feat_eyebrow: 'Features',
    feat_h2_a: 'Built for the messy ',
    feat_h2_em: 'middle',
    feat_h2_b: ' of a project.',
    feat1_t: 'Rich text in every note',
    feat1_p:
      'Headings, lists, quotes, code, links — Tiptap inside each note, with concurrent formatting that converges. Two people can bold the same word at once.',
    feat2_t: 'Edits that survive bad wifi',
    feat2_p:
      "Every change lands in your local Yjs doc and IndexedDB before anything else. Lose your connection mid-thought — keep typing. We'll sync the rest later.",
    feat3_t: 'A history you can rewind',
    feat3_p:
      'Every meaningful change is logged with author and time. Save named versions before risky moments. Restore the canvas to any point — for everyone, at once.',
    feat4_t: "See who's thinking with you",
    feat4_p:
      "Live cursors with names and colors, in-editor carets, and a soft lock when someone's actively typing in a note. Presence is ephemeral — it never clutters history.",
    cases_eyebrow: 'Use cases',
    cases_h2_a: 'For the meetings where ',
    cases_h2_em: 'everyone has to write',
    cases_h2_b: '.',
    case1_t: 'Discovery workshops',
    case1_p:
      'Get the brief, the customer quotes, and the wild ideas onto one canvas before the energy drains out of the room.',
    case2_t: 'Sprint retros',
    case2_p:
      'Three columns, six people, ten minutes of silent writing — then dot-vote. Distributed teams get the same room as the people in person.',
    case3_t: 'Quarterly planning',
    case3_p:
      "Drag bets across columns, rename a theme inline, restore yesterday's draft — and never wonder which Slack thread had the latest version.",
    cta_h2_a: 'A canvas your team ',
    cta_h2_em: 'already trusts',
    cta_h2_b: '.',
    cta_sub: 'Sign in with Google, name a room, share the link. Klistra is free while in beta.',
    footer_built: 'Built in Stockholm',
    footer_signin: 'Sign in with Google',
  },
  sv: {
    nav_how: 'Så funkar det',
    nav_features: 'Funktioner',
    nav_cases: 'Användning',
    cta_primary: 'Fortsätt med Google',
    cta_secondary: 'Se hur det funkar',
    hero_eyebrow: 'En yta för att tänka tillsammans',
    hero_h1_a: 'En post-it-yta som ',
    hero_h1_em: 'aldrig försvinner',
    hero_h1_b: '.',
    hero_lede:
      'Klistra håller allas lappar i samma rum — med rik text, livecursor och en historik du kan spola tillbaka. Det funkar även när wifi:t inte gör det.',
    meta_realtime: 'Realtid, peer-to-peer',
    meta_offline: 'Offline-först',
    meta_versioned: 'Versionerad',
    how_eyebrow: 'Så funkar det',
    how_h2_a: 'Dina ändringar landar på ',
    how_h2_em: 'fyra ställen',
    how_h2_b: ', i tur och ordning.',
    how_sub:
      'De två första är direkt. De två sista händer i bakgrunden, så ytan väntar aldrig på nätet. Därför känns det likadant online som offline.',
    how_copy_h: 'En ändring är "klar" så fort skärmen uppdateras.',
    how_copy_p:
      'Realtidssynk mellan personer går peer-to-peer. Molnet är för minne, historik och att kunna öppna rum du aldrig sett förut — inte för varje tangenttryck.',
    how_li1_t: 'Konfliktfritt från grunden',
    how_li1_d: 'Samtidiga ändringar smälter ihop — ingen merge-dialog, inga förlorade tecken.',
    how_li2_t: 'Peer-to-peer i realtid',
    how_li2_d: 'WebRTC flyttar dina ändringar direkt mellan kollegor.',
    how_li3_t: 'Molnet som minne, inte flaskhals',
    how_li3_d: 'Snapshots och strukturerad logg skickas till Firestore i bakgrunden.',
    flow_title: 'Synk-hierarki · per ändring',
    flow_1_t: 'Yjs-dokument',
    flow_2_t: 'y-indexeddb',
    flow_3_t: 'y-webrtc',
    flow_4_t: 'Firestore',
    flow_sync: 'synk',
    flow_async: 'async',
    feat_eyebrow: 'Funktioner',
    feat_h2_a: 'Byggd för den ',
    feat_h2_em: 'stökiga mitten',
    feat_h2_b: ' av ett projekt.',
    feat1_t: 'Rik text i varje lapp',
    feat1_p:
      'Rubriker, listor, citat, kod, länkar — Tiptap i varje lapp, och samtidig formatering som möts utan konflikt. Två personer kan fetstila samma ord.',
    feat2_t: 'Ändringar som överlever dåligt wifi',
    feat2_p:
      'Allt landar i ditt lokala Yjs-dokument och IndexedDB först. Tappa nätet mitt i en tanke — fortsätt skriva. Vi synkar resten sen.',
    feat3_t: 'En historik du kan spola',
    feat3_p:
      'Varje meningsfull ändring loggas med författare och tid. Spara namngivna versioner inför stora steg. Återställ ytan till valfri punkt — för alla på en gång.',
    feat4_t: 'Se vilka som tänker med dig',
    feat4_p:
      'Livecursor med namn och färg, carets i editorn, och en mjuk lås-indikator när någon skriver i en lapp. Närvaro är flyktig — den skräpar aldrig ner historiken.',
    cases_eyebrow: 'Användning',
    cases_h2_a: 'För mötena där ',
    cases_h2_em: 'alla måste skriva',
    cases_h2_b: '.',
    case1_t: 'Insiktsworkshops',
    case1_p:
      'Få ner briefen, kundcitaten och de vilda idéerna på en yta innan energin runnit ut ur rummet.',
    case2_t: 'Sprint-retron',
    case2_p:
      'Tre kolumner, sex personer, tio minuter tyst skrivande — sedan dot-vote. Distribuerade team får samma rum som de på plats.',
    case3_t: 'Kvartalsplanering',
    case3_p:
      'Dra satsningar mellan kolumner, byt namn inline, återställ gårdagens utkast — och slipp gissa vilken Slack-tråd som hade senaste versionen.',
    cta_h2_a: 'En yta ditt team ',
    cta_h2_em: 'redan litar på',
    cta_h2_b: '.',
    cta_sub: 'Logga in med Google, döp ett rum, dela länken. Klistra är gratis under betan.',
    footer_built: 'Byggd i Stockholm',
    footer_signin: 'Logga in med Google',
  },
}
