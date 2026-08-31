document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => document.activeElement?.blur()));
