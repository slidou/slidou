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
// C'EST ICI QUE TU MODIFIES TOUT !
const books = {
  "Fiodor Dostoïevski": [
    { 
      title: "Crime et Châtiment", 
      year: 1866, 
      note: 10, 
      cover: "covers/crime.jpg", /* Mets le chemin vers ton image ici */
      link: "https://www.goodreads.com/book/show/5145.Crime_and_Punishment" 
    },
    { 
      title: "L'Idiot", 
      year: 1869, 
      note: 9, 
      cover: "covers/idiot.jpg", 
      link: "https://www.goodreads.com/book/show/5144.The_Idiot" 
    }
  ],
  "Albert Camus": [
    { 
      title: "L'Étranger", 
      year: 1942, 
      note: 9, 
      cover: "covers/etranger.jpg", 
      link: "https://www.goodreads.com/book/show/50164452-l-tranger" 
    },
    { 
      title: "La Peste", 
      year: 1947, 
      note: 8, 
      cover: "covers/peste.jpg", 
      link: "https://www.goodreads.com/book/show/9760.La_Peste" 
    }
  ],
  
  // ── EXEMPLE POUR AJOUTER UN NOUVEL AUTEUR ──
  "George Orwell": [
    { 
      title: "1984", 
      year: 1949, 
      note: 10, 
      cover: "covers/1984.jpg", 
      link: "https://www.goodreads.com/book/show/5470.1984" 
    }
  ]
};

// ── Generate Bibliography ──
// C'EST ICI QU'ON ENLÈVE LE DOUBLON DU TITRE SI TU LE SOUHAITES
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
      
      // J'ai enlevé <div class="book-title"> pour ne garder que l'image. 
      // Le titre sera visible en survolant l'image (grâce au "alt").
      // Si tu veux le titre sous l'image, ajoute cette ligne avant la fermeture de l'apostrophe :
      // <div class="book-title">${book.title}</div>
      card.innerHTML = `
        <img src="${book.cover}" alt="${book.title} (${book.year})">
        <div class="book-meta">${book.year} • ${book.note}/10</div>
      `;
      booksDiv.appendChild(card);
    });

    container.appendChild(booksDiv);
  }
}
