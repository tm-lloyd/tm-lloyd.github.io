class AcademicContentRenderer {
  constructor(content) {
    this.content = content;
    this.toggleCounter = 0;
  }

  renderSection(sectionData, sectionTitle, options = {}) {
    const { showImages = false, expandAbstracts = false } = options;

    // Items flagged "hidden": true stay in content.json but are not rendered.
    const items = (sectionData || []).filter((item) => !item.hidden);
    if (items.length === 0) return '';

    const sectionId = sectionTitle.toLowerCase().replace(/\s+/g, '');
    const sectionClass = sectionTitle === 'Publications' ? '' : ' class="content-section--spaced"';
    let html = `<h2 id="${sectionId}"${sectionClass}>${escapeHtml(sectionTitle)}</h2>\n`;

    items.forEach((item) => {
      html += '<div class="paper-card">\n';
      html += this.renderItem(item, { showImages, expandAbstracts });
      html += '</div>\n';
    });

    return html;
  }

  renderItem(item, options = {}) {
    const { showImages = false, expandAbstracts = false } = options;

    return [
      this.renderTitle(item),
      this.renderAuthors(item.authors),
      this.renderJournal(item),
      this.renderAdditionalInfo(item),
      this.renderPresentations(item),
      this.renderNews(item),
      this.renderAbstract(item, expandAbstracts),
      this.renderPress(item),
      this.renderImage(item, showImages)
    ].join('');
  }

  renderTitle(item) {
    const title = escapeHtml(item.title);

    if (item.url) {
      return `<h3 class="paper-title"><a href="${escapeAttr(item.url)}" target="_blank" rel="noopener">${title}</a></h3>\n`;
    }

    return `<h3 class="paper-title">${title}</h3>\n`;
  }

  renderAuthors(authors) {
    if (!authors || authors.length === 0) return '';

    const coAuthors = authors.filter((author) => author.name !== 'Thomas Lloyd');
    if (coAuthors.length === 0) return '';

    const authorLinks = coAuthors.map((author) => {
      const name = escapeHtml(author.name);
      if (author.url) {
        return `<a href="${escapeAttr(author.url)}" target="_blank" rel="noopener">${name}</a>`;
      }
      return name;
    });

    return `<p class="paper-meta">(with ${authorLinks.join(' & ')})</p>\n`;
  }

  renderJournal(item) {
    if (!item.journal) return '';
    return `<p class="paper-meta"><em>${escapeHtml(item.journal)}, ${escapeHtml(item.year)}</em></p>\n`;
  }

  renderAdditionalInfo(item) {
    let html = '';

    if (item.workingPaperUrl) {
      html += `<p class="paper-meta"><em><a href="${escapeAttr(item.workingPaperUrl)}" target="_blank" rel="noopener">[${escapeHtml(item.workingPaperText)}]</a></em></p>\n`;
    }

    if (item.wpSeriesUrl) {
      const newLabel = item.isNew ? '<span class="badge-new">NEW</span> ' : '';
      html += `<p class="paper-meta"><em>${newLabel}<a href="${escapeAttr(item.wpSeriesUrl)}" target="_blank" rel="noopener">${escapeHtml(item.wpSeriesText)}</a></em>, ${escapeHtml(item.date)}</p>\n`;
    }

    return html;
  }

  renderPresentations(item) {
    const presentations = normalizeEntries(item.presentations ?? item.presentation);
    const venues = presentations.map((presentation) => {
      const entry = normalizeEntry(presentation);
      if (!entry) return null;

      const venue = entry.text.replace(/^Presented at\s+(?:the\s+)?/i, '');
      const text = entry.url
        ? `<a href="${escapeAttr(entry.url)}" target="_blank" rel="noopener">${escapeHtml(venue)}</a>`
        : escapeHtml(venue);
      const coauthorMarker = entry.byCoauthor
        ? '<sup class="coauthor-marker" aria-hidden="true">*</sup><span class="sr-only"> (presentation by a co-author)</span>'
        : '';

      return `${text}${coauthorMarker}`;
    }).filter(Boolean);

    if (venues.length === 0) return '';
    return `<p class="paper-meta"><em>Presented at ${formatList(venues)}</em></p>\n`;
  }

  renderNews(item) {
    return normalizeEntries(item.news).map((newsItem) => {
      const entry = normalizeEntry(newsItem);
      if (!entry) return '';

      const text = entry.url
        ? `<a href="${escapeAttr(entry.url)}" target="_blank" rel="noopener">${escapeHtml(entry.text)}</a>`
        : escapeHtml(entry.text);

      return `<p class="paper-meta paper-news"><em>${text}</em></p>\n`;
    }).join('');
  }

  renderPress(item) {
    if (!item.press || !Array.isArray(item.press) || item.press.length === 0) return '';

    const pressLinks = item.press.map((outlet) =>
      `<a href="${escapeAttr(outlet.url)}" target="_blank" rel="noopener">${escapeHtml(outlet.name)}</a>`
    ).join(', ');

    return `<p class="paper-meta"><b>Press:</b> ${pressLinks}</p>\n`;
  }

  renderAbstract(item, expandAbstracts) {
    if (!item.abstract) return '';

    const abstract = escapeHtml(item.abstract);

    if (expandAbstracts) {
      return `<p class="paper-meta">${abstract}</p>\n`;
    }

    const toggleId = this.toggleCounter++;
    return [
      '<p class="paper-meta">',
      `<button class="abstract-toggle" type="button" aria-expanded="false" aria-controls="pubabs_${toggleId}" data-abstract-toggle="${toggleId}">`,
      'Abstract <span class="abstract-toggle-icon" aria-hidden="true">&#9660;</span>',
      '</button>',
      `<span id="pubabs_${toggleId}" class="abstract-text" hidden>: ${abstract}</span>`,
      '</p>\n'
    ].join('');
  }

  renderImage(item, showImages) {
    if (!showImages || !item.image) return '';

    const widthClass = item.imageWidth === '80%' ? 'paper-image--medium' : 'paper-image--full';
    const altText = `Figure from "${item.title}"`;

    return `<img src="${escapeAttr(item.image)}" alt="${escapeAttr(altText)}" class="paper-image ${widthClass}" loading="lazy">\n`;
  }

  renderAll(containerOrId, options = {}) {
    const container = typeof containerOrId === 'string'
      ? document.getElementById(containerOrId)
      : containerOrId;

    if (!container) return;

    const sections = [
      [this.content.publications, 'Publications'],
      [this.content.workingPapers, 'Working Papers'],
      [this.content.workInProgress, 'Work in Progress']
    ];

    const visibleItems = sections.flatMap(([sectionData]) =>
      (sectionData || []).filter((item) => !item.hidden)
    );
    const hasCoauthorPresentation = visibleItems.some((item) =>
      normalizeEntries(item.presentations ?? item.presentation).some((presentation) =>
        typeof presentation === 'object' && presentation !== null && presentation.byCoauthor
      )
    );

    const sectionsHtml = sections
      .map(([sectionData, sectionTitle]) => this.renderSection(sectionData, sectionTitle, options))
      .join('');
    const presentationFootnote = hasCoauthorPresentation
      ? '<p class="presentation-footnote" role="note">* Presentation by a co-author</p>'
      : '';

    container.innerHTML = sectionsHtml + presentationFootnote;

    this.bindAbstractToggles(container);
  }

  bindAbstractToggles(container) {
    container.querySelectorAll('.abstract-toggle').forEach((button) => {
      button.addEventListener('click', function() {
        const targetId = button.getAttribute('aria-controls');
        const abstract = document.getElementById(targetId);
        const icon = button.querySelector('.abstract-toggle-icon');

        if (!abstract) return;

        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        abstract.hidden = expanded;
        if (icon) icon.innerHTML = expanded ? '&#9660;' : '&#9650;';
      });
    });
  }
}

async function loadAcademicContent() {
  if (window.academicContent) return window.academicContent;

  const response = await fetch('./js/content.json?v=2026-09-04-4');
  if (!response.ok) throw new Error('Failed to load academic content');

  window.academicContent = await response.json();
  return window.academicContent;
}

async function renderAcademicContent(containerOrId, options = {}) {
  const container = typeof containerOrId === 'string'
    ? document.getElementById(containerOrId)
    : containerOrId;

  if (!container) return;

  try {
    const content = await loadAcademicContent();
    const renderer = new AcademicContentRenderer(content);
    renderer.renderAll(container, options);
  } catch (error) {
    console.warn(error);
    container.textContent = 'Research content could not be loaded.';
  }
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, function(character) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character];
  });
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function normalizeEntries(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function normalizeEntry(value) {
  if (typeof value === 'string') return { text: value };
  if (!value || typeof value !== 'object' || !value.text) return null;
  return value;
}

function formatList(items) {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-academic-content]').forEach(function(container) {
    renderAcademicContent(container, {
      showImages: container.dataset.showImages === 'true',
      expandAbstracts: container.dataset.expandAbstracts === 'true'
    });
  });
});

window.AcademicContentRenderer = AcademicContentRenderer;
window.loadAcademicContent = loadAcademicContent;
window.renderAcademicContent = renderAcademicContent;
