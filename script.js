const data = {
  bipedality: { title: 'bipedality', date: '2026-03-27', text: 'Standing upright changes everything. Perspective, balance, the way light hits the face at golden hour.' },
  oyasumi: { title: 'oyasumi', date: '2026-03-24', text: 'Started reading before sleep again. No phone, just a book and the small lamp.' },
  drifting: { title: 'drifting', date: '2026-03-19', text: 'Not the car kind. The mind kind. Sitting in the van, engine off, windows down.' },
  slow: { title: 'slow morning', date: '2026-03-12', text: 'Coffee, open window, no schedule. The light at 7am in March has a specific quality.' },
  concrete: { title: 'concrete waves', date: '2026-03-05', text: 'The expressway at night from the passenger seat looks like an ocean.' },
  neon: { title: 'neon & fog', date: '2026-02-28', text: 'Found a pocket of fog near the Han River. The neon dissolved into it like watercolor.' }
};

document.querySelectorAll('.link').forEach(l => {
  l.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('.link').forEach(x => x.classList.remove('active'));
    l.classList.add('active');
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + l.dataset.page).classList.add('active');
    if (l.dataset.page === 'thoughts') {
      document.querySelector('.thoughts-list').style.display = 'flex';
      document.getElementById('thoughtDetail').style.display = 'none';
    }
    document.querySelector('.main').scrollTop = 0;
  });
});

document.querySelectorAll('.thought').forEach(t => {
  t.addEventListener('click', e => {
    e.preventDefault();
    const d = data[t.dataset.t];
    document.querySelector('.thoughts-list').style.display = 'none';
    document.getElementById('thoughtDetail').style.display = 'block';
    document.getElementById('thoughtContent').innerHTML =
      '<h2>' + d.title + '</h2><div class="d">[' + d.date + ']</div><p>' + d.text + '</p>';
    document.querySelector('.main').scrollTop = 0;
  });
});

document.getElementById('backBtn').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('thoughtDetail').style.display = 'none';
  document.querySelector('.thoughts-list').style.display = 'flex';
});
