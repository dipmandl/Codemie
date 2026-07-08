export const DeleteReleaseNoteSelectors = {
  // List / cards
  releaseList: '#release-list',
  releaseCard: '.release-card',
  cardTitle: '.release-title',
  emptyState: '.empty-state',

  // Actions
  deleteButton: "button.btn-delete[data-action='delete']",

  // Filters
  productFilterInput: '#product-filter',
  breakingFilterSelect: '#breaking-filter',
} as const;
