// ── Données des thoughts ──
const thoughts = {
  bipedality: {
    title: 'bipedality',
    date: '2026-03-27',
    body: `Standing upright changes everything — perspective, balance, the way light hits the face at golden hour. I keep coming back to this idea that the way we carry our body shapes the way we see the world.\n\nToday I shot a whole roll walking through Gangnam with the camera at chest height. No looking through the viewfinder. Just walking, pressing the shutter when something felt right.`
  },
  oyasumi: {
    title: 'oyasumi',
    date: '2026-03-24',
    body: `Started reading before sleep again. No phone, just a book and the small lamp. It changes the quality of rest completely.\n\nThere's a parallel to making work — the more noise you remove, the clearer the signal becomes. I think my best photos come from quiet days, not busy ones.`
  },
  drifting: {
    title: 'drifting',
    date: '2026-03-19',
    body: `Not the car kind. The mind kind. Letting a thought go without following it. Sitting in the van parked somewhere in Gapyeong, engine off, windows down, just listening.\n\nI don't think I captured anything worth keeping today but the act of being there was the point.`
  },
  'slow-morning': {
    title: 'slow morning',
    date: '2026-03-12',
    body: `Coffee, open window, no schedule. The light at 7am in March in Seoul has a specific quality — still cold but with warmth underneath. Like the city is half-asleep and half-awake at the same time.\n\nMade one frame I liked. A street vendor setting up, steam rising, backlit. That's enough.`
  },
  'concrete-waves': {
    title: 'concrete waves',
    date: '2026-03-05',
    body: `The expressway at night from the passenger seat looks like an ocean. Reflective road markings, headlights streaking, the guard rail cutting through like a horizon line.\n\nShot it on 1/4 second handheld. Most were blurry messes. Two of them worked. The imperfection is the texture.`
  },
  'neon-fog': {
    title: 'neon & fog',
    date: '2026-02-28',
    body: `Found a pocket of fog near the Han River last night. The neon from the bridges dissolved into it like watercolor. Stood there for an hour in the cold.\n\nSometimes a location gives you everything and you just need to show up and not mess it up.`
  },
  rearview: {
    title: 'rearview mirror',
    date: '2026-02-20',
    body: `Looking back at work from two years ago. Some of it holds up, most doesn't. That's a good sign — it means the taste has evolved faster than the skill.\n\nThe gap between what you see and what you can make is where all the energy comes from. Close it too fast and you stop growing.`
  },
  ' analogue': {
    title: 'analogue',
    date: '2026-02-14',
    body: `Picked up an FM2 again. No meter, no autofocus, no chimping. 36 frames, that's it. Every frame costs money and time.\n\nI forgot how much this discipline sharpens the eye. Digital makes you loose. Film makes you choose. Both are valid but I needed the reminder.`
  }
};

// ── Navigation ──
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = link.dataset.page;

    // Active link
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');

    // Show page
    pages.forEach(p => {
      p.classList.remove('active');
      p.style.display = 'none';
    });

    const page = document.getElementById('page-' + target);
    if (page) {
      page.style.display = 'block';
      page.classList.add('active');
    }

    // Reset thoughts view when clicking "Thoughts" in nav
    if (target === 'thoughts') {
      document.querySelector('.thoughts-list').style.display = 'flex';
      document.getElementById('page-thought-detail').style.display = 'none';
    }

    // Scroll to top
    document.querySelector('.content').scrollTop = 0;
  });
});

// ── Thought click → detail ──
document.querySelectorAll('.thought').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const key = el.dataset.thought;
    const data = thoughts[key];
    if (!data) return;

    // Hide list, show detail
    document.querySelector('.thoughts-list').style.display = 'none';
    const detail = document.getElementById('page-thought-detail');
    detail.style.display = 'block';
    detail.classList.add('active');

    // Fill content
    const content = document.getElementById('thoughtDetail');
    content.innerHTML = `
      <h2>${data.title}</h2>
      <div class="detail-date">[${data.date}]</div>
      ${data.body.split('\n\n').map(p => `<p>${p}</p>`).join('')}
    `;

    document.querySelector('.content').scrollTop = 0;
  });
});

// ── Back to thoughts list ──
document.getElementById('backToThoughts').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('page-thought-detail').style.display = 'none';
  document.querySelector('.thoughts-list').style.display = 'flex';
});
