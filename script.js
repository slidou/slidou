document.querySelectorAll('.menu-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Retirer la classe active de tous les liens
        document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
        // Ajouter au lien cliqué
        link.classList.add('active');
        
        // Cacher toutes les sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        // Afficher la section correspondante
        const sectionId = link.getAttribute('data-section');
        document.getElementById(sectionId).classList.add('active');
    });
});
