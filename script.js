async function loadResources() {
  const response = await fetch('RESOURCE_INDEX.csv');
  const csv = await response.text();
  const rows = parseCSV(csv);

  const topicFilter = document.getElementById('topicFilter');
  const nhsFilter = document.getElementById('nhsFilter');
  const camhsFilter = document.getElementById('camhsFilter');
  const searchInput = document.getElementById('searchInput');

  const topics = [...new Set(rows.map(r => r.Topic).filter(Boolean))].sort();

  topics.forEach(topic => {
    const option = document.createElement('option');
    option.value = topic;
    option.textContent = topic;
    topicFilter.appendChild(option);
  });

  function render() {
    const search = searchInput.value.toLowerCase();
    const topic = topicFilter.value;
    const nhs = nhsFilter.value;
    const camhs = camhsFilter.value;

    const filtered = rows.filter(resource => {
      const searchable = Object.values(resource).join(' ').toLowerCase();

      const matchesSearch = searchable.includes(search);
      const matchesTopic = !topic || resource.Topic === topic;
      const matchesNhs = !nhs || String(resource.NHS_Relevant).toLowerCase() === nhs;
      const matchesCamhs = !camhs || String(resource.CAMHS_Relevant).toLowerCase() === camhs;

      return matchesSearch && matchesTopic && matchesNhs && matchesCamhs;
    });

    document.getElementById('resultCount').textContent = `${filtered.length} resource(s) found`;

    const container = document.getElementById('resourceList');
    container.innerHTML = '';

    filtered.forEach(resource => {
      const card = document.createElement('article');
      card.className = 'resource-card';

      card.innerHTML = `
        <h3>${resource.Title || 'Untitled resource'}</h3>
        <p><strong>Source:</strong> ${resource.Source_Organisation || 'Unknown'}</p>
        <div class="meta">
          <span class="badge">${resource.Topic || 'General'}</span>
          <span class="badge">NHS: ${resource.NHS_Relevant}</span>
          <span class="badge">CAMHS: ${resource.CAMHS_Relevant}</span>
          <span class="badge">Access: ${resource.Access_Level || 'Unknown'}</span>
        </div>
        <p>${resource.Notes || ''}</p>
        <a class="resource-link" href="${resource.URL}" target="_blank" rel="noopener noreferrer">Open resource</a>
      `;

      container.appendChild(card);
    });
  }

  [searchInput, topicFilter, nhsFilter, camhsFilter].forEach(el => {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  render();
}

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.match(/(?:"([^"]*(?:""[^"]*)*)")|([^,]+)/g) || [];

    const cleaned = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"'));

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