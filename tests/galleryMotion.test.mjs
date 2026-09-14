import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceGalleryMotion } from '../src/lib/galleryMotion.ts';

function run(position, velocity, fps = 60, target = null) {
  let state = { position, velocity, target };
  const samples = [];
  for (let i = 0; i < fps * 6; i++) {
    state = advanceGalleryMotion(state, 1 / fps);
    samples.push(state);
    if (state.done) break;
  }
  return samples;
}
test('release retains velocity and coasts instead of snapping', () => {
  const next = advanceGalleryMotion(
    { position: 0.3, velocity: 7, target: null },
    1 / 60
  );
  assert.ok(next.position > 0.3 && next.position < 0.5);
  assert.ok(next.velocity > 6 && next.velocity < 7);
  assert.equal(next.done, false);
});
test('fast swipes travel farther in either direction and settle', () => {
  for (const sign of [1, -1]) {
    const slow = run(0, sign * 2).at(-1);
    const fast = run(0, sign * 9).at(-1);
    assert.ok(fast.done && slow.done);
    assert.ok(Math.abs(fast.position) > Math.abs(slow.position));
    assert.equal(Math.sign(fast.position), sign);
    assert.equal(fast.velocity, 0);
  }
});
test('spring overshoot is small and converges without visible last-frame snap', () => {
  const samples = run(0, 0, 60, 1);
  assert.ok(Math.max(...samples.map((s) => s.position)) > 1);
  assert.ok(Math.max(...samples.map((s) => s.position)) < 1.03);
  assert.ok(samples.at(-1).done);
  assert.ok(
    Math.abs(samples.at(-1).position - samples.at(-2).position) < 0.001
  );
});
test('30, 60, and 144 Hz converge on the same destination', () => {
  const finals = [30, 60, 144].map((fps) => run(0.3, 8, fps).at(-1));
  assert.ok(finals.every((s) => s.done && s.position === finals[0].position));
});
test('a delayed frame cannot destabilize the spring', () => {
  const state = advanceGalleryMotion(
    { position: 1.1, velocity: -3, target: 1 },
    2
  );
  assert.ok(
    Number.isFinite(state.position) && Math.abs(state.position - 1) < 0.2
  );
});
