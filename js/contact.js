(function () {
  'use strict';
  var form = document.getElementById('form');
  var status = document.getElementById('status');
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var rules = {
    name: function (v) { if (!v) return 'Enter your name.'; if (v.length < 2) return 'Name must be at least 2 characters.'; return ''; },
    email: function (v) { if (!v) return 'Enter your email address.'; if (!emailRe.test(v)) return 'Enter a valid email, like john@example.com.'; return ''; },
    message: function (v) { if (!v) return 'Write a message.'; if (v.length < 10) return 'Message must be at least 10 characters.'; return ''; }
  };

  function check(field) {
    var msg = rules[field.name](field.value.trim());
    document.getElementById(field.name + '-err').textContent = msg;
    field.classList.toggle('invalid', !!msg);
    field.setAttribute('aria-invalid', !!msg);
    return !msg;
  }

  Object.keys(rules).forEach(function (n) {
    var f = form.elements[n];
    f.addEventListener('blur', function () { check(f); });
    f.addEventListener('input', function () { if (f.classList.contains('invalid')) check(f); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    var firstBad = null;
    Object.keys(rules).forEach(function (n) {
      var f = form.elements[n];
      if (!check(f) && !firstBad) firstBad = f;
    });
    if (firstBad) { firstBad.focus(); return; }

    /* No backend: opens the visitor's mail app with the message filled in.
       To send directly, swap this for a fetch() to Formspree or EmailJS. */
       
    var d = new FormData(form);
    var body = d.get('message') + '\n\nFrom: ' + d.get('name') + ' <' + d.get('email') + '>';
    status.textContent = 'Thanks, ' + d.get('name') + '. Your email app should open with the message ready to send.';
    window.location.href = 'mailto:shagith06@gmail.com?subject=' +
      encodeURIComponent('Portfolio message from ' + d.get('name')) + '&body=' + encodeURIComponent(body);
    form.reset();
  });
})();
