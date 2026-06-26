export const teamNameData = {
  route: '/product_release_dashboard/',
  release: {
    product: 'Billing API',
    version: 'v1.4.0',
    title: 'Release title',
    description: 'Some summary',
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
