export const EditReleaseNoteSelectors = {
  // Form
  releaseForm: '#release-form',
  productInput: '#product',
  versionInput: '#version',
  titleInput: '#title',
  descriptionTextarea: '#description',
  releaseDateInput: '#releaseDate',
  breakingCheckbox: '#breaking',
  submitButton: '#submit-btn',
  cancelButton: '#cancel-edit-btn',

  // Filters
  productFilterInput: '#product-filter',
  breakingFilterSelect: '#breaking-filter',

  // List / cards
  releaseList: '#release-list',
  releaseCard: '.release-card',
  cardTitle: '.release-title',
  cardDescription: '.release-description',
  emptyState: '.empty-state',
  editButton: "button.btn-edit[data-action='edit']",
} as const;
