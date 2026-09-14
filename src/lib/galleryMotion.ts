export type GalleryMotion = {
  position: number;
  velocity: number;
  target: number | null;
};

// Positions are measured in photos, velocity in photos/second.
export function advanceGalleryMotion(state: GalleryMotion, elapsed: number) {
  let { position, velocity, target } = state;
  // Small integration steps keep spring behavior consistent at 30–144 Hz.
  const duration = Math.min(Math.max(elapsed, 0), 0.05);
  const steps = Math.max(1, Math.ceil(duration / (1 / 240)));
  const dt = duration / steps;
  for (let i = 0; i < steps; i++) {
    if (target === null) {
      const decay = Math.exp(-5 * dt);
      position += (velocity * (1 - decay)) / 5;
      velocity *= decay;
      if (Math.abs(velocity) < 1.2)
        target = Math.round(position + velocity / 5);
    } else {
      // Damping ratio .85: a small overshoot that settles quickly.
      velocity += ((target - position) * 100 - 17 * velocity) * dt;
      position += velocity * dt;
    }
  }
  const done =
    target !== null &&
    Math.abs(position - target) < 0.0004 &&
    Math.abs(velocity) < 0.003;
  return {
    position: done ? target! : position,
    velocity: done ? 0 : velocity,
    target,
    done,
  };
}
