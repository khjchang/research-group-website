const projectsRoot = document.querySelector("[data-projects-source]");

if (projectsRoot) {
  loadProjects(projectsRoot);
}

async function loadProjects(container) {
  try {
    const response = await fetch(container.dataset.projectsSource, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Unable to load projects data: ${response.status}`);
    }

    const rows = parseCsv(await response.text())
      .filter((row) => row.active.toUpperCase() !== "FALSE")
      .sort((a, b) => Number(a.sort || 0) - Number(b.sort || 0));

    renderProjects(container, rows);
  } catch (error) {
    container.innerHTML = '<p class="main-page-font-size">Unable to load projects.</p>';
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

function renderProjects(container, projects) {
  container.innerHTML = "";

  for (const [section, rows] of groupBySection(projects)) {
    const heading = document.createElement("h1");
    heading.className = "project";
    heading.textContent = section;
    container.appendChild(heading);

    rows.forEach((project) => container.appendChild(createProjectItem(project)));
  }
}

function groupBySection(projects) {
  const grouped = new Map();

  for (const project of projects) {
    if (!grouped.has(project.section)) {
      grouped.set(project.section, []);
    }
    grouped.get(project.section).push(project);
  }

  return grouped;
}

function createProjectItem(project) {
  const item = document.createElement("div");
  item.className = "project-item";

  const title = document.createElement("h2");
  title.textContent = project.title;
  item.appendChild(title);

  if (project.subtitle) {
    const subtitle = document.createElement("p");
    subtitle.className = "members";
    subtitle.textContent = project.subtitle;
    item.appendChild(subtitle);
  }

  if (project.members) {
    const members = document.createElement("p");
    members.className = "members";
    members.innerHTML = `<span class="label"><i>Members:</i></span> ${escapeHtml(project.members)}`;
    item.appendChild(members);
  }

  return item;
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
