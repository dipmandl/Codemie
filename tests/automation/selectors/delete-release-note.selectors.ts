export const DeleteReleaseNoteSelectors = {
  // List / cards
  releaseList: '#release-list',
  releaseCard: '.release-card',
  cardTitle: '.release-title',
  emptyState: '.empty-state',
  deleteButton: "button.btn-delete[data-action='delete']",
  // Form (for edit-mode edge case)
  submitButton: '#submit-btn',
  cancelButton: '#cancel-edit-btn',
} as const;
