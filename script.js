/**
 * Main application function to load, parse, filter, and render resources.
 */
async function loadResources() {
  // Fetching the CSV dataset with a cache-busting timestamp query string
  const response = await fetch(`RESOURCE_INDEX.csv?v=${Date.now()}`);
  const csv = await response.text();
  const rows = parseCSV(csv);

  // Core Search and Selection UI inputs
  const searchInput = document.getElementById('searchInput');
  const contextFilter = document.getElementById('contextFilter');
  const audienceFilter = document.getElementById('audienceFilter');
  const formatFilter = document.getElementById('formatFilter');
  const sourceTypeFilter = document.getElementById('sourceTypeFilter');
  const accessFilter = document.getElementById('accessFilter');

  // Quick Filter Checkboxes (Fixed selectors to match index.html)
  const openOnlyCheckbox = document.getElementById('openOnly');
  const verifiedOnlyCheckbox = document.getElementById('verifiedOnly');

  // Track the currently active age filter chip (null means no specific age selected)
  let selectedAgeFilter = null;
  // Track the currently active quick section ("featured", "transition", etc.)
  let currentSection = null;

  // Populate drop-down filter menus with unique sorted values from CSV columns
  populateFilter(contextFilter, rows, 'Clinical_Context');
  populateFilter(audienceFilter, rows, 'Audience_Type');
  populateFilter(formatFilter, rows, 'Accessibility_Format');
  populateFilter(sourceTypeFilter, rows, 'Source_Type');
  populateFilter(accessFilter, rows, 'Access_Level');

  /**
   * Evaluates all current filter states and returns matching rows.
   */
  function getFilteredRows() {
    const search = searchInput.value.toLowerCase();

    let filtered = rows.filter(resource => {
      // Concatenate all object values together into a single text block for searchable queries
      const searchable = Object.values(resource).join(' ').toLowerCase();

      // Checkbox 1: If "Open access only" is checked, item must be 'Open'
      const matchesOpen = !openOnlyCheckbox.checked || resource.Access_Level === 'Open';

      // Checkbox 2: If "Verified resources only" is checked, item must have Verified === 'True'
      // Adjust column string token matching to match your CSV metadata layout exactly
      const matchesVerified = !verifiedOnlyCheckbox.checked || resource.Verified === 'True';

      // Age Chips Filter: Match selected chip with resource metadata column (e.g., Target_Age or Audience_Type)
      const matchesAge = !selectedAgeFilter || 
                         (resource.Target_Age && resource.Target_Age.includes(selectedAgeFilter)) || 
                         selectedAgeFilter === 'All ages';

      return (
        searchable.includes(search) &&
        matches(resource.Clinical_Context, contextFilter.value) &&
        matches(resource.Audience_Type, audienceFilter.value) &&
        matches(resource.Accessibility_Format, formatFilter.value) &&
        matches(resource.Source_Type, sourceTypeFilter.value) &&
        matches(resource.Access_Level, accessFilter.value) &&
        matchesOpen &&
        matchesVerified &&
        matchesAge
      );
    });

    // Handle "Good starting points" quick workflow button filters
    if (currentSection === 'featured') {
      filtered = filtered.filter(r => r.Featured === 'True');
    }

    if (currentSection === 'transition') {
      // Transition clinical workflow: targets older adolescents or transition-specific resources
      filtered = filtered.filter(r => 
        (r.Clinical_Context && r.Clinical_Context.includes('Transition')) ||
        (r.Notes && r.Notes.toLowerCase().includes('transition')) ||
        (r.Target_Age && r.Target_Age.includes('12–17'))
      );
    }

    if (currentSection === 'medication') {
      filtered = filtered.filter(r => r.Clinical_Context === 'Medication');
    }

    if (currentSection === 'crisis') {
      filtered = filtered.filter(r =>
        r.Clinical_Context === 'Crisis' ||
        r.Clinical_Context === 'General Mental Health'
      );
    }

    if (currentSection === 'neuro') {
      filtered = filtered.filter(r =>
        r.Clinical_Context === 'Neurodevelopmental' ||
        r.Clinical_Context === 'Learning Disability'
      );
    }

    if (currentSection === 'navigation') {
      filtered = filtered.filter(r => r.Clinical_Context === 'NHS Navigation' || r.Clinical_Context === 'Hospital Preparation');
    }

    // Default Sorting Matrix: Featured rows top, Open access next, then alphabetical Title sort
    filtered.sort((a, b) => {
      if (a.Featured === 'True' && b.Featured !== 'True') return -1;
      if (a.Featured !== 'True' && b.Featured === 'True') return 1;
      if (a.Access_Level === 'Open' && b.Access_Level !== 'Open') return -1;
      if (a.Access_Level !== 'Open' && b.Access_Level === 'Open') return 1;
      return a.Title.localeCompare(b.Title);
    });

    return filtered;
  }

  /**
   * Updates the user interface view grid.
   */
  function render() {
    const filtered = getFilteredRows();

    document.getElementById('resultCount').textContent = `${filtered.length} resource(s) found`;

    // Render Featured items shelf if active items are available
    const featuredContainer = document.getElementById('featuredSection');
    featuredContainer.innerHTML = '';

    // Extract up to 6 designated featured rows to present in upper hero grid layout
    const featuredRows = filtered.filter(r => r.Featured === 'True').slice(0, 6);

    if (featuredRows.length && !currentSection) {
      featuredContainer.innerHTML = `
        <h2>Featured Resources</h2>
        <div class="resource-list featured-grid"></div>
      `;
      const grid = featuredContainer.querySelector('.featured-grid');
      featuredRows.forEach(resource => grid.appendChild(createCard(resource)));
    }

    // Populate main lower content body container area grid
    const container = document.getElementById('resourceList');
    container.innerHTML = '';

    if (filtered.length === 0) {
      container.innerHTML = `<p class="muted">No resources match the selected filter criteria.</p>`;
    } else {
      filtered.forEach(resource => {
        container.appendChild(createCard(resource));
      });
    }
  }

  // Setup layout Section Workflow Buttons event clicks
  document.querySelectorAll('.section-button').forEach(button => {
    button.addEventListener('click', () => {
      // Toggle workflow section filter state on/off on repetitive clicking
      if (currentSection === button.dataset.section) {
        currentSection = null;
        button.classList.remove('active');
      } else {
        document.querySelectorAll('.section-button').forEach(b => b.classList.remove('active'));
        currentSection = button.dataset.section;
        button.classList.add('active');
      }
      render();
    });
  });

  // Setup Age Relevance Chip group selections
  document.querySelectorAll('#ageChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      if (selectedAgeFilter === chip.dataset.age) {
        selectedAgeFilter = null; // Uncheck chip if clicked twice
        chip.classList.remove('active');
      } else {
        document.querySelectorAll('#ageChips .chip').forEach(c => c.classList.remove('active'));
        selectedAgeFilter = chip.dataset.age;
        chip.classList.add('active');
      }
      render();
    });
  });

  // Setup Reset Filters Button listener Action
  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      contextFilter.value = '';
      audienceFilter.value = '';
      formatFilter.value = '';
      sourceTypeFilter.value = '';
      accessFilter.value = '';
      openOnlyCheckbox.checked = true;
      verifiedOnlyCheckbox.checked = true;
      selectedAgeFilter = null;
      currentSection = null;
      
      document.querySelectorAll('#ageChips .chip, .section-button').forEach(c => c.classList.remove('active'));
      render();
    });
  }

  // Attach dynamic filter value input/change events to drop-downs and input elements
  [searchInput, contextFilter, audienceFilter, formatFilter, sourceTypeFilter, accessFilter, openOnlyCheckbox, verifiedOnlyCheckbox]
    .forEach(el => {
      if (el) {
        el.addEventListener('input', () => render());
        el.addEventListener('change', () => render());
      }
    });

  // INITIAL RUN: Solves Cause B by executing immediately on initial CSV load while respecting checked attributes!
  render();
}

/**
 * Creates and returns a structured article DOM Element representing a resource card layout component.
 */
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
      <span class="badge">${resource.Target_Age || resource.Audience_Type || 'All'}</span>
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

/**
 * Utility helper to populate custom option selections inside selector menus safely.
 */
function populateFilter(element, rows, field) {
  if (!element || element.tagName !== 'SELECT') return;

  const values = [...new Set(rows.map(r => r[field]).filter(Boolean))].sort();

  // Clear existing variables excluding default placeholder choice row
  const firstOption = element.options[0];
  element.innerHTML = '';
  if (firstOption) element.appendChild(firstOption);

  values.forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    element.appendChild(option);
  });
}

/**
 * Simple truth assignment checker tool.
 */
function matches(value, selected) {
  return !selected || value === selected;
}

/**
 * Robust RFC 4180 compliant basic CSV parsing engine layout logic.
 */
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

// Global script initial processing engine execution string trigger setup
loadResources().catch(error => {
  const counterElement = document.getElementById('resultCount');
  if (counterElement) counterElement.textContent = 'Unable to load resources.';
  console.error(error);
});