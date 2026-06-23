// Lässt die "Kästchen" (construction-box) der Maus folgen.
// Jede Box neigt sich leicht in Richtung des Mauszeigers (3D-Tilt-Effekt).

document.addEventListener('DOMContentLoaded', () => {
  const boxes = document.querySelectorAll('.construction-box, .team-card');

  // Wie stark sich die Box maximal neigen darf (in Grad).
  const MAX_TILT = 12;

  document.addEventListener('mousemove', (event) => {
    boxes.forEach((box) => {
      const rect = box.getBoundingClientRect();

      // Mittelpunkt der Box.
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Abstand der Maus zum Mittelpunkt, normiert auf -1 .. 1.
      const deltaX = (event.clientX - centerX) / (rect.width / 2);
      const deltaY = (event.clientY - centerY) / (rect.height / 2);

      // Begrenzen, damit weit entfernte Boxen nicht extrem kippen.
      const clampedX = Math.max(-1, Math.min(1, deltaX));
      const clampedY = Math.max(-1, Math.min(1, deltaY));

      // Neigung: nach oben/unten (X-Achse) und links/rechts (Y-Achse).
      const rotateX = -clampedY * MAX_TILT;
      const rotateY = clampedX * MAX_TILT;

      box.style.transform =
        `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  });

  // Beim Verlassen des Fensters die Boxen zurücksetzen.
  document.addEventListener('mouseleave', () => {
    boxes.forEach((box) => {
      box.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg)';
    });
  });
});
