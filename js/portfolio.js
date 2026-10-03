(function () {
  'use strict';
  var grid = document.getElementById('grid');
  var filters = document.getElementById('filters');
  var modal = document.getElementById('modal');
  var closeBtn = document.getElementById('m-close');
  var projects = [], lastFocus = null;

  var fallbackProjects = [
    {
      "id": 1,
      "title": "Management Information System",
      "description": "Leading Phase-2 development of the University of Ruhuna's MIS. Designing a responsive frontend using React.js and creating UI/UX prototypes in Figma. Implementing key functionalities for record management and enhancing communication between students, lecturers, and administrators.",
      "tags": ["Spring Boot", "React", "Java", "JavaScript", "PostgreSQL"]
    },
    {
      "id": 2,
      "title": "Speech Therapy Mobile App",
      "description": "Developed a speech therapy mobile app using Dart and Flutter. Incorporated machine learning for pronunciation improvement through video and lip movement analysis. Designed an intuitive user interface for a seamless user experience.",
      "tags": ["Dart", "Flutter", "Firebase"]
    },
    {
      "id": 3,
      "title": "Doctor Appointment Management System",
      "description": "Built a Doctor Appointment Management System using the MERN stack. Enabled online appointment booking with CRUD functionality for managing doctors, patients, and appointments. Developed a responsive React-based user interface.",
      "tags": ["MongoDB", "Express.js", "React", "Node.js"]
    },
    {
      "id": 4,
      "title": "Doctor Appointment Mobile Application",
      "description": "Developed a Doctor Appointment mobile app using Kotlin, Android Studio, and Firebase. Implemented features such as appointment booking, doctor management, and secure data storage. Designed a modern and user-friendly interface for enhanced usability.",
      "tags": ["Kotlin", "Flutter", "Firebase"]
    }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function renderFilters() {
    if (!filters) return;
    filters.textContent = '';
    var tags = ['All'];
    projects.forEach(function (p) {
      p.tags.forEach(function (t) {
        if (tags.indexOf(t) < 0) tags.push(t);
      });
    });

    tags.forEach(function (t, i) {
      var b = el('button', '', t);
      b.type = 'button';
      b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      b.addEventListener('click', function () {
        filters.querySelectorAll('button').forEach(function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        renderGrid(t);
      });
      filters.appendChild(b);
    });
  }

  function renderGrid(tag) {
    if (!grid) return;
    grid.textContent = '';
    var filtered = projects.filter(function (p) {
      return tag === 'All' || p.tags.indexOf(tag) > -1;
    });

    if (filtered.length === 0) {
      var emptyMsg = el('p', 'muted', 'No projects found matching the selected filter.');
      emptyMsg.style.gridColumn = '1 / -1';
      emptyMsg.style.padding = '2rem 0';
      grid.appendChild(emptyMsg);
      return;
    }

    filtered.forEach(function (p) {
      var card = el('button', 'card');
      card.type = 'button';
      card.setAttribute('aria-label', 'View details for ' + p.title);

      var cardHeader = el('div', 'card-header');
      cardHeader.appendChild(el('h3', '', p.title));
      
      var arrow = el('div', 'card-arrow');
      arrow.innerHTML = '<svg viewBox="0 0 24 24"><path d="M5 19L19 5M19 5H9M19 5V15" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
      cardHeader.appendChild(arrow);
      card.appendChild(cardHeader);

      card.appendChild(el('p', '', p.description));

      var chips = el('ul', 'chips');
      p.tags.forEach(function (t) {
        chips.appendChild(el('li', '', t));
      });
      card.appendChild(chips);

      card.addEventListener('click', function () {
        openModal(p);
      });
      grid.appendChild(card);
    });
  }

  function openModal(p) {
    if (!modal) return;
    lastFocus = document.activeElement;
    document.getElementById('m-title').textContent = p.title;
    document.getElementById('m-desc').textContent = p.description;
    var tags = document.getElementById('m-tags');
    tags.textContent = '';
    p.tags.forEach(function (t) {
      tags.appendChild(el('li', '', t));
    });
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!modal || modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') {
      e.preventDefault();
      if (closeBtn) closeBtn.focus();
    }
  });

  fetch('data/projects.json')
    .then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    })
    .then(function (data) {
      projects = data;
      renderFilters();
      renderGrid('All');
    })
    .catch(function () {
      // Fallback data ensures functionality even without web server / file protocol restrictions
      projects = fallbackProjects;
      renderFilters();
      renderGrid('All');
    });
})();
