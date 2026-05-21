async function loadResources() {
  const response = await fetch(`RESOURCE_INDEX.csv?v=${Date.now()}`);
  const csv = await response.text();
  const rows = parseCSV(csv);

  const searchInput = document.getElementById('searchInput');
  const contextFilter = document.getElementById('contextFilter');
  const audienceFilter = document.getElementById('audienceFilter');
  const formatFilter = document.getElementById('formatFilter');
  const sourceTypeFilter = document.getElementById('sourceTypeFilter');
  const accessFilter = document.getElementById('accessFilter');

  populateFilter(contextFilter, rows, 'Clinical_Context');
  populateFilter(audienceFilter, rows, 'Audience_Type');
  populateFilter(formatFilter, rows, 'Accessibility_Format');
  populateFilter(sourceTypeFilter, rows, 'Source_Type');
  populateFilter(accessFilter, rows, 'Access_Level');

  function getFilteredRows(section = null) {
    const search = searchInput.value.toLowerCase();

    let filtered = rows.filter(resource => {
      const searchable = Object.values(resource).join(' ').toLowerCase();

      return (
        searchable.includes(search) &&
        matches(resource.Clinical_Context, contextFilter.value) &&
        matches(resource.Audience_Type, audienceFilter.value) &&
        matches(resource.Accessibility_Format, formatFilter.value) &&
        matches(resource.Source_Type, sourceTypeFilter.value) &&
        matches(resource.Access_Level, accessFilter.value)
      );
    });

    if (section === 'featured') {
      filtered = filtered.filter(r => r.Featured === 'True');
    }

    if (section === 'young') {
      filtered = filtered.filter(r =>
        r.Audience_Type.includes('Young') ||
        r.Audience_Type.includes('Families')
      );
    }

    if (section === 'medication') {
      filtered = filtered.filter(r => r.Clinical_Context === 'Medication');
    }

    if (section === 'crisis') {
      filtered = filtered.filter(r =>
        r.Clinical_Context === 'Crisis' ||
        r.Clinical_Context === 'General Mental Health'
      );
    }

    if (section === 'neuro') {
      filtered = filtered.filter(r =>
        r.Clinical_Context === 'Neurodevelopmental' ||
        r.Clinical_Context === 'Learning Disability'
      );
    }

    if (section === 'navigation') {
      filtered = filtered.filter(r => r.Clinical_Context === 'NHS Navigation');
    }

    filtered.sort((a, b) => {
      if (a.Featured === 'True' && b.Featured !== 'True') return -1;
      if (a.Featured !== 'True' && b.Featured === 'True') return 1;
      if (a.Access_Level === 'Open' && b.Access_Level !== 'Open') return -1;
      if (a.Access_Level !== 'Open' && b.Access_Level === 'Open') return 1;
      return a.Title.localeCompare(b.Title);
    });

    return filtered;
  }

  function render(section = null) {
    const filtered = getFilteredRows(section);

    document.getElementById('resultCount').textContent = `${filtered.length} resource(s) found`;

    const featuredContainer = document.getElementById('featuredSection');
    featuredContainer.innerHTML = '';

    const featuredRows = getFilteredRows('featured').slice(0, 6);

    if (featuredRows.length) {
      featuredContainer.innerHTML = `
        <h2>Featured Resources</h2>
        <div class="resource-list featured-grid"></div>
      `;

      const grid = featuredContainer.querySelector('.featured-grid');
      featuredRows.forEach(resource => grid.appendChild(createCard(resource)));
    }

    const container = document.getElementById('resourceList');
    container.innerHTML = '';

    filtered.forEach(resource => {
      container.appendChild(createCard(resource));
    });
  }

  document.querySelectorAll('.section-button').forEach(button => {
    button.addEventListener('click', () => {
      render(button.dataset.section);
    });
  });

  [searchInput, contextFilter, audienceFilter, formatFilter, sourceTypeFilter, accessFilter]
    .forEach(el => {
      el.addEventListener('input', () => render());
      el.addEventListener('change', () => render());
    });

  render();
}

function createCard(resource) {
  const card = document.createElement('article');

  const restricted = resource.Access_Level === 'Restricted';
  const featured = resource.Featured === 'True';

  card.className = `resource-card ${restricted ? 'restricted' : ''} ${featured ? 'featured' : ''}`;

  card.innerHTML = `
    <h3>${resource.Title || 'Untitled resource'}</h3>
    <div class="source-line"><strong>Source:</strong> ${resource.Source_Organisation || 'Unknown'}</div>

    <div class="meta">
      <span class="badge">${resource.Clinical_Context || 'General'}</span>
      <span class="badge">${resource.Accessibility_Format || 'Accessible'}</span>
      <span class="badge">${resource.Audience_Type || 'All'}</span>
      <span class="badge">${resource.Source_Type || 'Source'}</span>
      <span class="badge ${resource.Access_Level === 'Open' ? 'access-open' : 'access-restricted'}">
        ${resource.Access_Level || 'Unknown'}
      </span>
    </div>

    <p>${resource.Notes || ''}</p>

    <a class="resource-link" href="${resource.URL}" target="_blank" rel="noopener noreferrer">
      Open resource
    </a>
  `;

  return card;
}

function populateFilter(element, rows, field) {
  const values = [...new Set(rows.map(r => r[field]).filter(Boolean))].sort();

  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    element.appendChild(option);
  });
}

function matches(value, selected) {
  return !selected || value === selected;
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.match(/(?:"([^"]*(?:""[^"]*)*)")|([^,]+)/g) || [];

    const cleaned = values.map(v =>
      v.replace(/^"|"$/g, '').replace(/""/g, '"')
    );

    const entry = {};

    headers.forEach((header, index) => {
      entry[header.trim()] = cleaned[index] ? cleaned[index].trim() : '';
    });

    return entry;
  });
}

loadResources().catch(error => {
  document.getElementById('resultCount').textContent = 'Unable to load resources.';
  console.error(error);
});