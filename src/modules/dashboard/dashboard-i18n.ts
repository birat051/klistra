import {
  KLISTRA_DEFAULT_LOCALE,
  isKlistraLocale,
  type IKlistraLocale,
} from '@/common/i18n/klistra-locales'

export type IDashboardLocale = IKlistraLocale

/** UI copy for the dashboard module (`design/Dashboard.html` I18N `en` / `sv` + product section labels). */
export interface IDashboardCopy {
  searchPlaceholder: string
  sortRecent: string
  greetA: string
  greetB: string
  greetSub: string
  accountAria: string
  sectionOwned: string
  sectionCollaborating: string
  countDoc: string
  countDocs: string
  emptyOwnedHeading: string
  emptyOwnedSub: string
  fab: string
  fabAria: string
  modalTitle: string
  modalSubtitle: string
  modalPlaceholder: string
  modalCreate: string
  modalCancel: string
  modalColorGroup: string
  modalNoteColorPrefix: string
  delete: string
  deleteConfirm: string
}

/** Mirrors `design/Dashboard.html` dashboard strings where available. */
export const DASHBOARD_COPY: Record<IDashboardLocale, IDashboardCopy> = {
  en: {
    searchPlaceholder: 'Search canvases…',
    sortRecent: 'Sort: Recent',
    greetA: 'Welcome back, ',
    greetB: '.',
    greetSub: 'Pick up where you left off, or start something new.',
    accountAria: 'Account',
    sectionOwned: 'My documents',
    sectionCollaborating: 'Collaborating',
    countDoc: 'document',
    countDocs: 'documents',
    emptyOwnedHeading: 'No documents yet',
    emptyOwnedSub: 'Pick up where you left off, or start something new.',
    fab: 'New canvas',
    fabAria: 'Create new canvas',
    modalTitle: 'Name your canvas',
    modalSubtitle: 'You can rename it any time.',
    modalPlaceholder: 'e.g. Sprint retro · week 18',
    modalCreate: 'Create canvas',
    modalCancel: 'Cancel',
    modalColorGroup: 'Default note color',
    modalNoteColorPrefix: 'Note color',
    delete: 'Delete',
    deleteConfirm: 'Delete this document?',
  },
  sv: {
    searchPlaceholder: 'Sök ytor…',
    sortRecent: 'Sortera: Senaste',
    greetA: 'Välkommen tillbaka, ',
    greetB: '.',
    greetSub: 'Forsätt där du slutade, eller starta något nytt.',
    accountAria: 'Konto',
    sectionOwned: 'Mina dokument',
    sectionCollaborating: 'Samarbeten',
    countDoc: 'dokument',
    countDocs: 'dokument',
    emptyOwnedHeading: 'Inga dokument än',
    emptyOwnedSub: 'Forsätt där du slutade, eller starta något nytt.',
    fab: 'Ny yta',
    fabAria: 'Skapa ny yta',
    modalTitle: 'Namnge din yta',
    modalSubtitle: 'Du kan döpa om den när som helst.',
    modalPlaceholder: 't.ex. Sprint-retro · v.18',
    modalCreate: 'Skapa yta',
    modalCancel: 'Avbryt',
    modalColorGroup: 'Standardfärg för lapp',
    modalNoteColorPrefix: 'Färg',
    delete: 'Ta bort',
    deleteConfirm: 'Ta bort det här dokumentet?',
  },
}

export function getDashboardCopy(locale: string): IDashboardCopy {
  return isKlistraLocale(locale) ? DASHBOARD_COPY[locale] : DASHBOARD_COPY[KLISTRA_DEFAULT_LOCALE]
}
