// ── Thoughts data ──
const thoughts = {
  bipedality: {
    title: 'bipedality',
    date: '2026-03-27',
    body: `<p>hey do you pronounce it bipedal or bipedal or bipedal or bipedal</p><p>one might say i think it should be pronounced bipedal</p><p>my latest obsession over the past week has been a bipedal robot that i am planning on making with several of my friends</p><p>its super cool to learn stuff and then also finally see some stuff from class make its way into something i'm doing.</p>`
  },
  oyasumi: {
    title: 'oyasumi',
    date: '2026-03-24',
    body: `<p>i think my success rate for recommending oyasumi punpun to other people in my life is around 5%. why it's so low i'm not sure, it seems to be quite infamous.</p><p>oyasumi punpun may be my favorite overall manga. i mean, i would say it fits into my top 5 pieces of writing of all time, probably even top 5 general pieces of media.</p>`
  },
  oysters: {
    title: 'oysters with a squeeze of lemon',
    date: '2026-01-18',
    body: `<p>have you ever been the best at something?</p><p>i don't think i've ever been so good at something that one could look at me and consider me a master at my craft.</p><p>i think what i fear most is that the most i'll ever amount to is someone who was obsessed with the idea of obsession.</p>`
  },
  'the-one': {
    title: 'searching for the one',
    date: '2026-01-19',
    body: `<p>surprisingly, or maybe not surprisingly, out of my group of closer friends, there is a very small percentage who have significant others.</p><p>it's a very easy way out to just say that you're working on yourself, you don't need to search or chase for love. but i think this is a thin veil meant to protect me from rejection.</p>`
  },
  nanimo: {
    title: 'nanimo',
    date: '2026-01-25',
    body: `<p>there was this time in fifth grade where i had a really big crush on this girl. i don't think i knew if i had a crush on her at the time. but there's this really really really burnt in core memory that i have of us together.</p><p>i was reading naruto at the library, and she kept trying to talk to me. but for some reason every time i would try to respond, my chest would tighten up and i felt my face turn red.</p><p>i really want to rewatch naruto.</p>`
  },
  'cs-majors': {
    title: 'the state of the cs major',
    date: '2026-01-26',
    body: `<p>my friend who is one year under me had a pretty long conversation with me the other week which first prompted my thinking upon this topic.</p><p>i don't have enough time to write out all my advice, but here's a general frame you can follow:</p><p>1. try to get freshman experience as soon as you can.</p><p>2. attend your career fair if you would like a job.</p><p>3. cold email and spam apply.</p><p>4. i find that finding the human connection is a lot easier at smaller companies.</p>`
  }
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

    // Reset thoughts detail when clicking Thoughts
    if (page === 'thoughts') {
      document.getElementById('page-thought').classList.remove('active');
    }

    document.querySelector('.content').scrollTop = 0;
  });
});

// ── Thought click → detail ──
document.querySelectorAll('[data-slug]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    const slug = el.dataset.slug;
    const data = thoughts[slug];
    if (!data) return;

    // Hide thoughts list
    document.getElementById('page-thoughts').classList.remove('active');

    // Show thought detail
    const detail = document.getElementById('page-thought');
    document.getElementById('thoughtTitle').textContent = data.title;
    document.getElementById('thoughtDate').textContent = '[' + data.date + ']';
    document.getElementById('thoughtBody').innerHTML = data.body;
    detail.classList.add('active');

    document.querySelector('.content').scrollTop = 0;
  });
});

// ── Back to thoughts ──
document.getElementById('backToThoughts').addEventListener('click', e => {
  e.preventDefault();
  document.getElementById('page-thought').classList.remove('active');
  document.getElementById('page-thoughts').classList.add('active');
});
