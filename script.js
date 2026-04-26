async function loadGroomingData() {
  const res = await fetch("./data.json?v=1", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load data.json (${res.status})`);
  return res.json();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text ?? "";
}

function setLink(id, href, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.href = href;
  el.textContent = text ?? href;
}

function renderPriceList(items = []) {
  return items.map(item => {
    const note = item.note ? ` <span class="price-note">(${escapeHtml(item.note)})</span>` : "";
    return `<li><span>${escapeHtml(item.name)}${note}</span><strong>${escapeHtml(item.price)}</strong></li>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[ch]));
}

function renderPackages(packages = []) {
  const grid = document.getElementById("packageGrid");
  if (!grid) return;

  grid.innerHTML = packages.map(pkg => `
    <article class="price-card">
      <h2>${escapeHtml(pkg.name)}</h2>
      <p class="weight">${escapeHtml(pkg.weight)}</p>
      <p class="price">${escapeHtml(pkg.price)}</p>
    </article>
  `).join("");
}

function renderPackageNotes(notes = []) {
  const wrap = document.getElementById("packageNotes");
  if (!wrap) return;

  wrap.innerHTML = notes.map((note, index) => `
    <p class="section-note${index > 0 ? " section-note--sub" : ""}">${escapeHtml(note)}</p>
  `).join("");
}

function renderServiceColumns(columns = []) {
  const wrap = document.getElementById("serviceColumns");
  if (!wrap) return;

  wrap.innerHTML = columns.map((col, index) => `
    <article class="info-card${index === 2 ? " info-card--accent" : ""}">
      <h2>${escapeHtml(col.title)}</h2>
      <ul class="price-list">
        ${renderPriceList(col.items)}
      </ul>
    </article>
  `).join("");
}

function renderExtras(extras = []) {
  const list = document.getElementById("extrasList");
  if (!list) return;
  list.innerHTML = renderPriceList(extras);
}

function renderContactList(data) {
  const list = document.getElementById("contactList");
  if (!list) return;

  list.innerHTML = `
    <li><strong>Business:</strong> ${escapeHtml(data.businessName)}</li>
    <li><strong>Phone:</strong> ${escapeHtml(data.phoneDisplay)}</li>
    <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
    <li><strong>Type:</strong> ${escapeHtml(data.contactType)}</li>
    <li><strong>Area:</strong> ${escapeHtml(data.serviceArea.shortLabel)}</li>
  `;
}

function applyBasicFields(data) {
  const phoneHref = `tel:${data.phoneHref}`;
  const emailHref = `mailto:${data.email}`;

  setText("heroEyebrow", data.eyebrow);
  setText("businessName", data.businessName);
  setText("heroLead", data.heroLead);
  setText("serviceArea", data.serviceArea.summary);

  setText("aboutText", data.about);
  setText("bookingText", data.booking);
  setText("individualServicesNote", data.individualServicesNote);

  setLink("callBtn", phoneHref, `Call ${data.phoneDisplay}`);
  setLink("emailBtn", emailHref, "Email Natasha");

  setLink("phoneLink", phoneHref, data.phoneDisplay);
  setLink("emailLink", emailHref, data.email);

  setLink("callMiniBtn", phoneHref, "Call / Text");
  setLink("emailMiniBtn", emailHref, "Send Email");

  setText("footerBusinessName", data.businessName);
  setText("footerArea", data.serviceArea.shortLabel);
  setLink("footerPhone", phoneHref, data.phoneDisplay);
  setLink("footerEmail", emailHref, data.email);
}

async function init() {
  try {
    const data = await loadGroomingData();
    applyBasicFields(data);
    renderContactList(data);
    renderPackageNotes(data.packageNotes);
    renderPackages(data.packages);
    renderServiceColumns(data.serviceColumns);
    renderExtras(data.extras);
  } catch (err) {
    console.error(err);
  }
}

init();