export const DeleteReleaseNoteData = {
  storageKey: 'releaseNotesDashboard.releases',

  seedReleases: [
    {
      id: 'r1',
      product: 'Billing API',
      version: 'v1.4.0',
      teamName: 'Platform',
      title: 'Invoice export now supports CSV and XLSX',
      description: 'Added dual-format export and improved export speed for large accounts.',
      releaseDate: '2026-06-08',
      isBreaking: false,
    },
    {
      id: 'r2',
      product: 'Auth Service',
      version: 'v2.0.0',
      teamName: 'Security',
      title: 'Token introspection endpoint updated',
      description: 'Old response shape is deprecated. Clients should migrate to the new claims object format.',
      releaseDate: '2026-06-10',
      isBreaking: true,
    },
  ],
} as const;
