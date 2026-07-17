export const ReleaseNoteFormSelectors = {
  // Form
  releaseForm: '#release-form',
  productInput: '#product',
  versionInput: '#version',
  teamNameInput: '#teamName',
  titleInput: '#title',
  descriptionTextarea: '#description',
  releaseDateInput: '#releaseDate',
  breakingCheckbox: '#breaking',
  submitButton: '#submit-btn',
  cancelButton: '#cancel-edit-btn',

  // Validation ui
  formErrorSummary: '#form-error-summary',
  productError: '#product-error',
  versionError: '#version-error',
  titleError: '#title-error',
  descriptionError: '#description-error',
  releaseDateError: '#releaseDate-error',

  // List/cards
  releaseList: '#release-list',
  releaseCard: '.release-card',
  cardTitle: '.release-title',
} as const;
