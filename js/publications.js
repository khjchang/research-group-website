const publicationRoot = document.querySelector("[data-publications-source]");

if (publicationRoot) {
  loadPublications(publicationRoot);
}

async function loadPublications(container) {
  try {
    const response = await fetch(container.dataset.publicationsSource, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load publications data: ${response.status}`);
    }

    const rows = parseCsv(await response.text())
      .filter((row) => row.active.toUpperCase() !== "FALSE")
      .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));

    renderPublications(container, rows);
  } catch (error) {
    container.innerHTML = '<p class="main-page-font-size">Unable to load publications.</p>';
    console.error(error);
  }
}

function parseCsv(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];
    const next = csv[index + 1];

    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value);
      if (row.some((cell) => cell.length > 0)) {
        rows.push(row);
      }
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows.shift() || [];
  return rows.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ""])));
}

function renderPublications(container, publications) {
  container.innerHTML = "";

  const grouped = groupBySection(publications);
  for (const [section, rows] of grouped) {
    if (section !== "Publications") {
      const heading = document.createElement("h1");
      heading.textContent = section === "Best Paper Award" ? "🏆 Best Paper Award" : section;
      container.appendChild(heading);
    }

    rows.forEach((publication) => container.appendChild(createPublicationItem(publication)));
  }
}

function groupBySection(publications) {
  const grouped = new Map();

  for (const publication of publications) {
    if (!grouped.has(publication.section)) {
      grouped.set(publication.section, []);
    }
    grouped.get(publication.section).push(publication);
  }

  return grouped;
}

function createPublicationItem(publication) {
  const item = document.createElement("div");
  item.className = publication.item_class || "publication-first";

  const citation = document.createElement("p");
  citation.className = "citation";
  citation.innerHTML = publication.citation_html;

  item.appendChild(citation);
  return item;
}
