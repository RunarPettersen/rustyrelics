import { apiFetch } from "../utils/apiFetch.js";

const form = document.getElementById("listing-form");
const imageContainer = document.getElementById("image-fields");
const addImageBtn = document.getElementById("add-image-btn");

if (!form) throw new Error("listing-form not found");
if (!imageContainer) throw new Error("image-fields not found");
if (!addImageBtn) throw new Error("add-image-btn not found");

const MAX_DESCRIPTION = 280;
const WARN_DESCRIPTION_AT = 240;

const submitBtn =
  form.querySelector('button[type="submit"]') ||
  form.querySelector("button");

if (!submitBtn) throw new Error("Submit button not found");

/** @type {string} */
const submitDefaultText = submitBtn.textContent?.trim() || "Submit";

/** @type {boolean} */
let isSubmitting = false;

/**
 * @param {Date} d
 * @param {number} years
 * @returns {Date}
 */
function addYears(d, years) {
  const copy = new Date(d);
  copy.setFullYear(copy.getFullYear() + years);
  return copy;
}

/**
 * Converts a Date to a value compatible with <input type="datetime-local">
 * @param {Date} d
 * @returns {string}
 */
function toDateTimeLocalValue(d) {
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}

/**
 * Ensures an element exists for inline field messages.
 * @param {HTMLElement} fieldEl
 * @param {string} id
 * @returns {HTMLElement}
 */
function ensureFieldMessage(fieldEl, id) {
  let msg = document.getElementById(id);
  if (msg) return msg;

  msg = document.createElement("p");
  msg.id = id;
  msg.className = "mt-1 text-sm text-red-600";
  msg.setAttribute("aria-live", "polite");
  msg.style.display = "none";

  fieldEl.insertAdjacentElement("afterend", msg);
  return msg;
}

/**
 * Shows/hides an inline error message.
 * @param {HTMLElement} msgEl
 * @param {string} text
 */
function setFieldError(msgEl, text) {
  if (!text) {
    msgEl.textContent = "";
    msgEl.style.display = "none";
    return;
  }
  msgEl.textContent = text;
  msgEl.style.display = "block";
}

/**
 * Ensures a top-of-form message area exists.
 * @returns {HTMLElement}
 */
function ensureFormMessage() {
  let el = document.getElementById("formMessage");
  if (el) return el;

  el = document.createElement("div");
  el.id = "formMessage";
  el.className = "hidden rounded-md border px-4 py-3 text-sm mb-4";
  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");

  form.insertAdjacentElement("afterbegin", el);
  return el;
}

/**
 * @param {"error"|"success"|"info"} type
 * @param {string} text
 */
function setFormMessage(type, text) {
  const el = ensureFormMessage();

  if (!text) {
    el.classList.add("hidden");
    el.textContent = "";
    return;
  }

  el.classList.remove("hidden");
  el.textContent = text;

  el.classList.remove(
    "border-red-200",
    "bg-red-50",
    "text-red-800",
    "border-green-200",
    "bg-green-50",
    "text-green-800",
    "border-gray-200",
    "bg-gray-50",
    "text-gray-800",
  );

  if (type === "error") {
    el.classList.add("border-red-200", "bg-red-50", "text-red-800");
  } else if (type === "success") {
    el.classList.add("border-green-200", "bg-green-50", "text-green-800");
  } else {
    el.classList.add("border-gray-200", "bg-gray-50", "text-gray-800");
  }
}

/**
 * Extracts a helpful API error message.
 * apiFetch currently throws: Error("API error: ...")
 * @param {unknown} err
 * @returns {string}
 */
function getErrorMessage(err) {
  if (err instanceof Error && err.message) return err.message;
  return "Something went wrong. Please try again.";
}

/**
 * Maps known API messages to field-level messages.
 * @param {string} msg
 * @returns {{ field?: "description"|"endsAt", text: string }}
 */
function mapApiError(msg) {
  const cleaned = msg.replace(/^API error:\s*/i, "").trim();

  if (/Description cannot be greater than 280 characters/i.test(cleaned)) {
    return { field: "description", text: "Description must be 280 characters or fewer." };
  }

  if (/endsAt cannot be past date or more than one year from now/i.test(cleaned)) {
    return { field: "endsAt", text: "End date must be in the future and within 1 year from now." };
  }

  return { text: cleaned || "Something went wrong. Please try again." };
}

/**
 * Clears all inline errors and form message.
 */
function clearAllMessages() {
  setFormMessage("info", "");
  setFieldError(descriptionErrorEl, "");
  setFieldError(endsAtErrorEl, "");
}

/**
 * @param {boolean} disabled
 */
function setSubmitDisabled(disabled) {
  submitBtn.disabled = disabled;
  submitBtn.setAttribute("aria-disabled", String(disabled));
  submitBtn.classList.toggle("opacity-60", disabled);
  submitBtn.classList.toggle("cursor-not-allowed", disabled);
}

/**
 * @param {boolean} submitting
 * @param {string=} label
 */
function setSubmitting(submitting, label) {
  isSubmitting = submitting;

  if (submitting) {
    submitBtn.textContent = label || "Submitting…";
  } else {
    submitBtn.textContent = submitDefaultText;
  }
}

/* ---------- Field wiring (description + endsAt) ---------- */

const titleEl =
  form.querySelector('[name="title"]') ||
  form.title;

const descriptionEl =
  form.querySelector('[name="description"]') ||
  form.description;

const endsAtEl =
  form.querySelector('[name="endsAt"]') ||
  form.endsAt;

if (!titleEl) throw new Error("title field not found");
if (!descriptionEl) throw new Error("description field not found");
if (!endsAtEl) throw new Error("endsAt field not found");

const descriptionErrorEl = ensureFieldMessage(descriptionEl, "descriptionError");
const endsAtErrorEl = ensureFieldMessage(endsAtEl, "endsAtError");

// Description counter + max length
descriptionEl.setAttribute("maxlength", String(MAX_DESCRIPTION));

const counterEl = document.createElement("p");
counterEl.className = "mt-1 text-sm text-gray-500";
counterEl.id = "descriptionCounter";
counterEl.setAttribute("aria-live", "polite");
descriptionEl.insertAdjacentElement("afterend", counterEl);

/**
 * @returns {number}
 */
function descriptionLength() {
  return String(descriptionEl.value || "").length;
}

/**
 * Updates character counter + error state for description.
 */
function updateDescriptionUI() {
  const len = descriptionLength();
  counterEl.textContent = `${len}/${MAX_DESCRIPTION}`;

  counterEl.classList.remove("text-gray-500", "text-amber-600", "text-red-600");

  if (len > MAX_DESCRIPTION) {
    counterEl.classList.add("text-red-600");
    setFieldError(descriptionErrorEl, `Description must be ${MAX_DESCRIPTION} characters or fewer.`);
    return;
  }

  if (len >= WARN_DESCRIPTION_AT) {
    counterEl.classList.add("text-amber-600");
  } else {
    counterEl.classList.add("text-gray-500");
  }

  // Clear only if it's our length message
  if (descriptionErrorEl.textContent?.toLowerCase().includes("characters or fewer")) {
    setFieldError(descriptionErrorEl, "");
  }
}

/**
 * Applies min/max bounds on endsAt:
 * - min: now + 1 minute
 * - max: now + 1 year
 */
function setEndsAtBounds() {
  const now = new Date();
  const max = addYears(now, 1);

  now.setMinutes(now.getMinutes() + 1);

  endsAtEl.setAttribute("min", toDateTimeLocalValue(now));
  endsAtEl.setAttribute("max", toDateTimeLocalValue(max));
}

setEndsAtBounds();
updateDescriptionUI();

/**
 * Validates endsAt input.
 * @returns {{ ok: boolean, message: string }}
 */
function validateEndsAt() {
  const raw = String(endsAtEl.value || "").trim();
  if (!raw) return { ok: false, message: "End date is required." };

  const chosen = new Date(raw);
  if (Number.isNaN(chosen.getTime())) {
    return { ok: false, message: "Please enter a valid end date." };
  }

  const now = new Date();
  const max = addYears(now, 1);

  if (chosen <= now) {
    return { ok: false, message: "End date must be in the future." };
  }

  if (chosen > max) {
    return { ok: false, message: "End date must be within 1 year from now." };
  }

  return { ok: true, message: "" };
}

/**
 * Computes whether the form is valid (client-side rules).
 * @returns {boolean}
 */
function isFormValid() {
  const title = String(titleEl.value || "").trim();
  if (!title) return false;

  if (descriptionLength() > MAX_DESCRIPTION) return false;

  const endsAt = validateEndsAt();
  if (!endsAt.ok) return false;

  return true;
}

/**
 * Updates submit disabled state based on validity + submitting state.
 */
function updateSubmitState() {
  const valid = isFormValid();
  setSubmitDisabled(!valid || isSubmitting);
}

/**
 * Live validation handler helper.
 */
function onFieldInteraction() {
  // don't wipe a success message after submit; only wipe errors/info
  setFormMessage("info", "");
  setFieldError(descriptionErrorEl, "");
  setFieldError(endsAtErrorEl, "");

  updateDescriptionUI();

  const endsAtCheck = validateEndsAt();
  if (!endsAtCheck.ok && String(endsAtEl.value || "").trim()) {
    setFieldError(endsAtErrorEl, endsAtCheck.message);
  } else {
    setFieldError(endsAtErrorEl, "");
  }

  updateSubmitState();
}

// Live events
titleEl.addEventListener("input", onFieldInteraction);
descriptionEl.addEventListener("input", onFieldInteraction);
endsAtEl.addEventListener("change", onFieldInteraction);
endsAtEl.addEventListener("input", onFieldInteraction);

// Initial
updateSubmitState();

/* ---------- Images (unchanged behaviour) ---------- */

/**
 * Adds another media URL + ALT field pair to the form.
 */
function addMediaFields() {
  const wrapper = document.createElement("div");
  wrapper.className = "mb-4";

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.name = "media-url";
  urlInput.placeholder = "Image URL";
  urlInput.className = "bg-white w-full mb-2 p-2 border rounded";

  const altInput = document.createElement("input");
  altInput.type = "text";
  altInput.name = "media-alt";
  altInput.placeholder = "Image ALT";
  altInput.className = "bg-white w-full p-2 border rounded";

  wrapper.append(urlInput, altInput);
  imageContainer.appendChild(wrapper);
}

addImageBtn.addEventListener("click", addMediaFields);

/* ---------- Submit ---------- */

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Prevent double submit
  if (isSubmitting) return;

  clearAllMessages();
  updateDescriptionUI();

  // Validate one last time (and show messages)
  const title = String(titleEl.value || "").trim();
  const description = String(descriptionEl.value || "").trim();
  const endsAtCheck = validateEndsAt();

  let hasError = false;

  if (!title) {
    setFormMessage("error", "Please fill in the required fields.");
    hasError = true;
  }

  if (description.length > MAX_DESCRIPTION) {
    setFieldError(descriptionErrorEl, `Description must be ${MAX_DESCRIPTION} characters or fewer.`);
    hasError = true;
  }

  if (!endsAtCheck.ok) {
    setFieldError(endsAtErrorEl, endsAtCheck.message);
    hasError = true;
  }

  if (hasError) {
    setFormMessage("error", "Please fix the errors and try again.");
    updateSubmitState();
    return;
  }

  const tags = (form.tags?.value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const listingData = {
    title,
    description,
    tags,
    endsAt: new Date(String(endsAtEl.value)).toISOString(),
  };

  const mediaUrls = Array.from(form.querySelectorAll('input[name="media-url"]'));
  const mediaAlts = Array.from(form.querySelectorAll('input[name="media-alt"]'));

  const media = mediaUrls
    .map((input, index) => {
      const url = input.value.trim();
      const alt = mediaAlts[index]?.value.trim() || "Listing image";
      return url ? { url, alt } : null;
    })
    .filter(Boolean);

  if (media.length > 0) {
    listingData.media = media;
  }

  try {
    setSubmitting(true, "Creating…");
    updateSubmitState();
    setFormMessage("info", "Creating listing…");

    const response = await apiFetch("/auction/listings", {
      method: "POST",
      body: JSON.stringify(listingData),
    });

    if (response?.id) {
      setFormMessage("success", "Listing created! Redirecting…");
      window.location.href = `/auctions/listing.html?id=${response.id}`;
      return;
    }

    console.error("No listing ID found in response:", response);
    setFormMessage("error", "Listing created, but no ID returned. Please check manually.");
  } catch (error) {
    console.error("Error creating listing:", error);

    const msg = getErrorMessage(error);
    const mapped = mapApiError(msg);

    setFormMessage("error", mapped.text);

    if (mapped.field === "description") setFieldError(descriptionErrorEl, mapped.text);
    if (mapped.field === "endsAt") setFieldError(endsAtErrorEl, mapped.text);
  } finally {
    setSubmitting(false);
    updateSubmitState();
  }
});