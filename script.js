const searchInput = document.getElementById('siteSearch');
const sections = Array.from(document.querySelectorAll('.doc-section'));
const navLinks = Array.from(document.querySelectorAll('#sectionNav a'));
const noResults = document.getElementById('noResults');
const backToTop = document.getElementById('backToTop');

function sectionText(section) {
  return `${section.innerText} ${section.dataset.keywords || ''}`.toLowerCase();
}

function runSearch() {
  if (!searchInput || !noResults) return;

  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  sections.forEach(section => {
    const matched = !query || sectionText(section).includes(query);
    section.classList.toggle('search-hidden', !matched);

    if (matched) {
      visibleCount += 1;
      if (query) {
        section.querySelectorAll('details').forEach(detail => { detail.open = true; });
      }
    }
  });

  document.body.classList.toggle('searching', Boolean(query));
  noResults.classList.toggle('show', visibleCount === 0);
}

if (searchInput) {
  searchInput.addEventListener('input', runSearch);
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    const id = visible.target.id;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0.05, 0.2, 0.5] });

  sections.forEach(section => observer.observe(section));
}

Array.from(document.querySelectorAll('.copy-btn')).forEach(button => {
  button.addEventListener('click', async () => {
    const text = button.dataset.copy || '';
    const old = button.textContent;

    try {
      await navigator.clipboard.writeText(text);
      button.textContent = 'Copied';
    } catch {
      button.textContent = 'Copy failed';
    }

    setTimeout(() => { button.textContent = old; }, 1200);
  });
});

if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 700);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
