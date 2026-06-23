// Parallax-Effekt: Alle Kästchen verschieben sich gleichzeitig in Richtung
// der Mausbewegung. Je nach Tiefe (depth) bewegt sich jede Box unterschiedlich
// stark, wodurch ein schwebender, mehrschichtiger Eindruck entsteht.

document.addEventListener('DOMContentLoaded', () => {
  const boxes = Array.from(
    document.querySelectorAll('.construction-box, .team-card')
  );

  // Maximale Verschiebung der "tiefsten" Box in Pixeln.
  const MAX_SHIFT = 35;

  // Jeder Box eine eigene Tiefe zuweisen (0.4 .. 1.0), damit sie sich
  // unterschiedlich stark mitbewegen -> Ebenen-/Parallax-Effekt.
  boxes.forEach((box, index) => {
    const depth = 0.4 + ((index % 5) / 5) * 0.6;
    box.dataset.depth = depth.toFixed(2);
  });

  // Aktuelle und Ziel-Position für eine weiche, nachlaufende Bewegung.
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  document.addEventListener('mousemove', (event) => {
    // Mausposition relativ zur Bildschirmmitte, normiert auf -1 .. 1.
    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animationsschleife: aktuelle Position sanft an die Zielposition annähern.
  function animate() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;

    boxes.forEach((box) => {
      const depth = parseFloat(box.dataset.depth);
      const shiftX = currentX * MAX_SHIFT * depth;
      const shiftY = currentY * MAX_SHIFT * depth;
      box.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
    });

    requestAnimationFrame(animate);
  }

  animate();
});
