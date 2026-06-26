export const teamNameData = {
  route: '/',
  release: {
    product: 'Billing API',
    version: 'v1.4.0',
    title: 'Release title',
    description: 'Some summary',
    releaseDate: '2026-06-26',
  },
  teamNames: {
    normal: 'Platform Team',
    padded: '   Platform Team   ',
    whitespaceOnly: '      ',
    withSpecialChars: 'Core/Infra & SRE - TeamA',
  },
  expected: {
    separator: ' ... ',
  },
};
