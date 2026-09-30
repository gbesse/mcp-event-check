import test from 'node:test';
import assert from 'node:assert/strict';
import { probe } from '../bin/mcp-event-check.js';

test('published SDK behavior is captured without masking a blocked listener', async () => {
  const result = await probe();
  assert.equal(result.firstThrew, true);
  assert.equal(typeof result.secondReceived, 'boolean');
  assert.equal(result.isolated, result.secondReceived);
});

test('an isolated transport passes the probe', async () => {
  const result = await probe(() => {
    const events = new Map();
    window.addEventListener('message', async event => {
      for (const listener of events.get(event.data.method) ?? []) {
        try { listener(event.data.params); } catch { /* deliberate isolation */ }
      }
    });
    return { on(method, listener) { events.set(method, [...(events.get(method) ?? []), listener]); }, dispose() {} };
  });
  assert.deepEqual(result, { firstThrew: true, secondReceived: true, isolated: true });
});
