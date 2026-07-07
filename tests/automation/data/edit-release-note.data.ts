export const EditReleaseNoteData = {
  storageKey: 'releaseNotesDashboard.releases',

  seedReleases: [
    {
      id: 'r1',
      product: 'Billing API',
      version: 'v1.4.0',
      teamName: '',
      title: 'Invoice export now supports CSV and XLSX',
      description: 'Added dual-format export and improved export speed for large accounts.',
      releaseDate: '2026-06-08',
      isBreaking: false,
    },
    {
      id: 'r2',
      product: 'Auth Service',
      version: 'v2.0.0',
      teamName: '',
      title: 'Token introspection endpoint updated',
      description: 'Old response shape is deprecated. Clients should migrate to the new claims object format.',
      releaseDate: '2026-06-10',
      isBreaking: true,
    },
  ],

  updates: {
    title: 'UPDATED: Invoice export supports CSV, XLSX and PDF',
    description: 'Updated description after edit.',
  },

  filters: {
    productBilling: 'Billing',
    productAuth: 'Auth',
    breakingOnly: 'breaking',
    nonBreakingOnly: 'non-breaking',
    all: 'all',
  },
} as const;
