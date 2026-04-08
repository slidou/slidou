// ── Bibliography data ──
const books = {
  "Fiodor Dostoïevski": [
    {
      title: "Le Rêve d'un homme ridicule",
      cover: "covers/ridicule.jpg",
      link: "https://www.goodreads.com/book/show/..."
    },
    {
      title: "Crime et Châtiment",
      cover: "covers/crime-chatiment.jpg",
      link: "https://www.goodreads.com/book/show/..."
    }
  ],
  "Albert Camus": [
    {
      title: "L'Étranger",
      cover: "covers/letranger.jpg",
      link: "https://www.goodreads.com/book/show/..."
    }
  ]
};

// ── Navigation ──
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.dataset.page;

    document.querySelectorAll('[data-page]').forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById('page-' + page);
    if (target) {
      target.classList.add('active');
    }

    // Générer bibliographie quand on clique dessus
    if (page === 'bibliography') {
      generateBibliography();
    }

    document.querySelector('.content').scrollTop = 0;
  });
});

// ── Génération Bibliographie ──
function generateBibliography() {
  const container = document.getElementById('bibliographyContent');
  container.innerHTML = ''; // reset

  for (const author in books) {
    const h2 = document.createElement('h2');
    h2.textContent = author;
    container.appendChild(h2);

    const bookContainer = document.createElement('div');
    bookContainer.className = 'books';

    books[author].forEach(book => {
      const a = document.createElement('a');
      a.href = book.link;
      a.target = '_blank';
      a.title = book.title;

      const img = document.createElement('img');
      img.src = book.cover;
      img.alt = book.title;

      a.appendChild(img);
      bookContainer.appendChild(a);
    });

    container.appendChild(bookContainer);
  }
}
