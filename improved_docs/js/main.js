/*
 * This script reads the structured content defined in content.js and dynamically
 * builds the research and home pages. By generating the DOM on page load
 * based on a single data source, we remove duplication between index.html
 * and research.html. To update publications, working papers or works in
 * progress, only edit the objects in content.js.
 */

// Helper to create an element with optional innerHTML and className
function createElem(tag, options = {}) {
  const el = document.createElement(tag);
  if (options.html) el.innerHTML = options.html;
  if (options.text) el.textContent = options.text;
  if (options.className) el.className = options.className;
  return el;
}

function buildPublicationItem(item) {
  const container = createElem('div', { className: 'research-item' });
  // Title
  const title = createElem('h3');
  const titleLink = createElem('a', { text: item.title });
  if (item.link) {
    titleLink.href = item.link;
    titleLink.target = '_blank';
  }
  title.appendChild(titleLink);
  container.appendChild(title);
  // Authors
  if (item.authors) {
    const authors = createElem('p', { html: item.authors });
    authors.className = 'authors';
    container.appendChild(authors);
  }
  // Journal
  if (item.journal) {
    const journal = createElem('p');
    journal.innerHTML = `<em>${item.journal}</em>`;
    journal.className = 'journal';
    container.appendChild(journal);
  }
  // Extras (e.g., working paper link)
  if (item.extras && Array.isArray(item.extras)) {
    item.extras.forEach(extra => {
      const pExtra = createElem('p');
      pExtra.innerHTML = `<em><a href="${extra.link}" target="_blank">${extra.text}</a></em>`;
      container.appendChild(pExtra);
    });
  }
  // Abstract
  if (item.abstract && item.abstract.trim().length > 0) {
    const details = createElem('details');
    const summary = createElem('summary', { text: 'Abstract' });
    details.appendChild(summary);
    const abs = createElem('p', { text: item.abstract.trim() });
    details.appendChild(abs);
    container.appendChild(details);
  }
  // Image
  if (item.image) {
    const img = createElem('img');
    img.src = item.image;
    img.alt = item.title;
    img.style.width = '100%';
    img.style.marginTop = '10px';
    container.appendChild(img);
  }
  return container;
}

function buildWorkingPaperItem(item) {
  const container = buildPublicationItem(item);
  // Additional details for working papers
  if (item.details) {
    const pDetails = createElem('p', { html: item.details });
    container.insertBefore(pDetails, container.querySelector('details') || null);
  }
  if (item.presentation) {
    const pPres = createElem('p', { text: item.presentation });
    container.insertBefore(pPres, container.querySelector('details') || null);
  }
  return container;
}

function buildWorkInProgressItem(item) {
  const container = createElem('div', { className: 'research-item' });
  const title = createElem('h3', { text: item.title });
  container.appendChild(title);
  if (item.authors) {
    const authors = createElem('p', { html: item.authors });
    authors.className = 'authors';
    container.appendChild(authors);
  }
  if (item.abstract && item.abstract.trim().length > 0) {
    const details = createElem('details');
    const summary = createElem('summary', { text: 'Abstract' });
    details.appendChild(summary);
    const abs = createElem('p', { text: item.abstract.trim() });
    details.appendChild(abs);
    container.appendChild(details);
  }
  return container;
}

function populateSection(containerId, items, builder) {
  const container = document.getElementById(containerId);
  if (!container) return;
  items.forEach(item => {
    const el = builder(item);
    container.appendChild(el);
    // Add a horizontal rule between items except after the last one
    if (item !== items[items.length - 1]) {
      const hr = createElem('hr');
      container.appendChild(hr);
    }
  });
}

function populateBio() {
  const bioContainer = document.getElementById('bio-container');
  if (!bioContainer) return;
  bioContainer.innerHTML = contentData.bio;
  // Add CV button
  const cvDiv = createElem('div', { className: 'cv-button-wrapper' });
  const cvButton = createElem('button');
  cvButton.className = 'button-2';
  cvButton.innerHTML = '<i class="bi bi-file-earmark-text"></i> <strong>Curriculum&nbsp;Vitae</strong>';
  cvButton.onclick = function() {
    window.open(contentData.cvPath, '_blank');
  };
  cvDiv.appendChild(cvButton);
  bioContainer.appendChild(cvDiv);
}

// Main entry point: call on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  // Determine which page we're on based on the presence of specific containers
  populateBio();
  populateSection('publications-container', contentData.publications, buildPublicationItem);
  populateSection('working-papers-container', contentData.workingPapers, buildWorkingPaperItem);
  populateSection('work-in-progress-container', contentData.workInProgress, buildWorkInProgressItem);
});