// ── Navigation ──
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;

    document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + page).classList.add('active');

    if (page === 'bibliography') generateBibliography();
  });
});

// ── Bibliography data ──
const books = {
  "Fiodor Dostoïevski": [
    { title:"Le Rêve d'un homme ridicule", year:1888, note:9, cover:"covers/ridicule.jpg", link:"https://www.goodreads.com/book/show/..." },
    { title:"Crime et Châtiment", year:1866, note:10, cover:"covers/crime-chatiment.jpg", link:"https://www.goodreads.com/book/show/..." }
  ],
  "Albert Camus": [
    { title:"L'Étranger", year:1942, note:9, cover:"covers/letranger.jpg", link:"https://www.goodreads.com/book/show/..." }
  ]
};

// ── Generate Bibliography ──
function generateBibliography() {
  const container = document.getElementById('bibliographyContent');
  container.innerHTML = '';

  for (const author in books) {
    const h2 = document.createElement('h2');
    h2.textContent = author;
    container.appendChild(h2);

    const booksDiv = document.createElement('div');
    booksDiv.className = 'books';

    books[author].forEach(book => {
      const card = document.createElement('a');
      card.href = book.link;
      card.target = "_blank";
      card.className = 'book-card';
      card.innerHTML = `
        <img src="${book.cover}" alt="${book.title}">
        <div class="book-title">${book.title}</div>
        <div class="book-meta">${book.year} • Note: ${book.note}/10</div>
      `;
      booksDiv.appendChild(card);
    });

    container.appendChild(booksDiv);
  }
}
