// Juste le clic actif sur les liens
document.querySelectorAll('.link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('.link.active')?.classList.remove('active');
    link.classList.add('active');
  });
});
