const STORAGE_KEY = "releaseNotesDashboard.releases";

const releaseForm = document.getElementById("release-form");
const releaseList = document.getElementById("release-list");
const template = document.getElementById("release-card-template");
const productFilterInput = document.getElementById("product-filter");
const breakingFilterSelect = document.getElementById("breaking-filter");
const submitBtn = document.getElementById("submit-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");

let releases = loadReleases();
let editingReleaseId = null;

renderReleaseList();

releaseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const updated = readFormValues();

  if (!updated.product || !updated.version || !updated.title || !updated.description || !updated.releaseDate) {
    return;
  }

  if (editingReleaseId) {
    releases = releases.map(r => r.id === editingReleaseId ? { ...r, ...updated } : r);
  } else {
    releases.unshift({ id: crypto.randomUUID(), ...updated });
  }

  saveReleases(releases);
  exitEditMode();
  renderReleaseList();
});

cancelEditBtn.addEventListener("click", () => {
  exitEditMode();
});

releaseList.addEventListener("click", (e) => {
  const editBtn = e.target.closest("[data-action='edit']");
  if (editBtn) {
    startEdit(editBtn.dataset.releaseId);
    return;
  }

  const deleteBtn = e.target.closest("[data-action='delete']");
  if (deleteBtn) {
    deleteRelease(deleteBtn.dataset.releaseId);
  }
});

productFilterInput.addEventListener("input", renderReleaseList);
breakingFilterSelect.addEventListener("change", renderReleaseList);

function startEdit(id) {
  const release = releases.find(r => r.id === id);
  if (!release) return;
  editingReleaseId = id;
  setFormValues(release);
  setEditModeUI(true);
  releaseForm.scrollIntoView({ behavior: "smooth" });
}

function exitEditMode() {
  editingReleaseId = null;
  releaseForm.reset();
  setEditModeUI(false);
}

function deleteRelease(id) {
  const release = releases.find(r => r.id === id);
  if (!release) return;

  const ok = window.confirm(`Delete release note "${release.title}"?`);
  if (!ok) return;

  releases = releases.filter(r => r.id !== id);
  saveReleases(releases);

  if (editingReleaseId === id) {
    exitEditMode();
  }

  renderReleaseList();
}

function setFormValues(release) {
  document.getElementById("product").value = release.product || "";
  document.getElementById("version").value = release.version || "";
  document.getElementById("teamName").value = release.teamName || "";
  document.getElementById("title").value = release.title || "";
  document.getElementById("description").value = release.description || "";
  document.getElementById("releaseDate").value = release.releaseDate || "";
  document.getElementById("breaking").checked = !!release.isBreaking;
}

function readFormValues() {
  const formData = new FormData(releaseForm);
  return {
    product: String(formData.get("product") || "").trim(),
    version: String(formData.get("version") || "").trim(),
    teamName: String(formData.get("teamName") || "").trim(),
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    releaseDate: String(formData.get("releaseDate") || ""),
    isBreaking: formData.get("breaking") === "on"
  };
}

function setEditModeUI(isEdit) {
  submitBtn.textContent = isEdit ? "Save Changes" : "Add Release Note";
  cancelEditBtn.classList.toggle("hidden", !isEdit);
}

function loadReleases() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedData();
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return seedData();
  }

  return seedData();
}

function saveReleases(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderReleaseList() {
  const productQuery = productFilterInput.value.trim().toLowerCase();
  const breakingQuery = breakingFilterSelect.value;

  const filtered = releases.filter((release) => {
    const matchesProduct = !productQuery || release.product.toLowerCase().includes(productQuery);
    const matchesBreaking =
      breakingQuery === "all" ||
      (breakingQuery === "breaking" && release.isBreaking) ||
      (breakingQuery === "non-breaking" && !release.isBreaking);

    return matchesProduct && matchesBreaking;
  });

  releaseList.innerHTML = "";

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No release notes match your current filters.";
    releaseList.appendChild(empty);
    return;
  }

  for (const release of filtered) {
    const card = template.content.firstElementChild.cloneNode(true);
    card.classList.toggle("breaking", release.isBreaking);

    card.querySelector(".product-version").textContent = `${release.product} - ${release.version}`;
    card.querySelector(".release-title").textContent = release.title;
    card.querySelector(".release-description").textContent = release.description;
    card.querySelector(".release-date").textContent = `Release date: ${formatDate(release.releaseDate)}`;

    const badge = card.querySelector(".badge");
    badge.textContent = release.isBreaking ? "Breaking Change" : "Non-Breaking";
    badge.classList.add(release.isBreaking ? "breaking" : "safe");

    const editBtn = card.querySelector("[data-action='edit']");
    editBtn.dataset.releaseId = release.id;

    const deleteBtn = card.querySelector("[data-action='delete']");
    deleteBtn.dataset.releaseId = release.id;

    releaseList.appendChild(card);
  }
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function seedData() {
  const initial = [
    {
      id: "r1",
      product: "Billing API",
      version: "v1.4.0",
      title: "Invoice export now supports CSV and XLSX",
      description: "Added dual-format export and improved export speed for large accounts.",
      releaseDate: "2026-06-08",
      isBreaking: false
    },
    {
      id: "r2",
      product: "Auth Service",
      version: "v2.0.0",
      title: "Token introspection endpoint updated",
      description: "Old response shape is deprecated. Clients should migrate to the new claims object format.",
      releaseDate: "2026-06-10",
      isBreaking: true
    }
  ];

  saveReleases(initial);
  return initial;
}
