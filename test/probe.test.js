import test from 'node:test';
import assert from 'node:assert/strict';
import { probe, isolatedControlTransport } from '../bin/mcp-event-check.js';

test('published SDK behavior is captured without masking a blocked listener', async () => {
  const result = await probe();
  assert.equal(result.firstThrew, true);
  assert.equal(typeof result.secondReceived, 'boolean');
  assert.equal(result.isolated, result.secondReceived);
});

test('an isolated transport passes the probe', async () => {
  const result = await probe(isolatedControlTransport);
  assert.deepEqual(result, { firstThrew: true, secondReceived: true, isolated: true });
});
