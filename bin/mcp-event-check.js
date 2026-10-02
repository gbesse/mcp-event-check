#!/usr/bin/env node
import { createAppTransport } from '@openai/mcp-extensions/app/transport';
import { pathToFileURL } from 'node:url';

const copy = {
  en: { title: 'MCP event listener check', good: 'Second listener received the notification.', bad: 'Second listener was blocked by the first error.', failed: 'The first listener threw as planned.', comparison: 'Control transport isolates the second listener.', usage: 'Usage: mcp-event-check [demo|check|compare] [--lang en|fr|es] [--json]' },
  fr: { title: 'Contrôle des événements MCP', good: 'Le second listener a reçu la notification.', bad: 'L’erreur du premier a bloqué le second listener.', failed: 'Le premier listener a échoué comme prévu.', comparison: 'Le transport témoin isole le second listener.', usage: 'Usage : mcp-event-check [demo|check|compare] [--lang en|fr|es] [--json]' },
  es: { title: 'Comprobación de eventos MCP', good: 'El segundo listener recibió la notificación.', bad: 'El error del primero bloqueó al segundo listener.', failed: 'El primer listener falló como estaba previsto.', comparison: 'El transporte de control aísla al segundo listener.', usage: 'Uso: mcp-event-check [demo|check|compare] [--lang en|fr|es] [--json]' }
};

export async function probe(factory = createAppTransport) {
  const before = globalThis.window;
  const handlers = new Map();
  const parent = { postMessage() {} };
  globalThis.window = {
    parent,
    addEventListener(name, handler) { handlers.set(name, handler); },
    removeEventListener(name) { handlers.delete(name); }
  };
  let secondReceived = false;
  let firstThrew = false;
  let transport;
  try {
    transport = factory();
    transport.on('sample/changed', () => { firstThrew = true; throw new Error('injected-listener-error'); });
    transport.on('sample/changed', () => { secondReceived = true; });
    const receiver = handlers.get('message');
    if (typeof receiver !== 'function') throw new Error('transport did not register a message listener');
    try {
      await receiver({ source: parent, data: { jsonrpc: '2.0', method: 'sample/changed', params: { value: 1 } } });
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'injected-listener-error') throw error;
    }
    return { firstThrew, secondReceived, isolated: firstThrew && secondReceived };
  } finally {
    transport?.dispose();
    if (before === undefined) delete globalThis.window;
    else globalThis.window = before;
  }
}

export function isolatedControlTransport() {
  const events = new Map();
  window.addEventListener('message', async event => {
    for (const listener of events.get(event.data.method) ?? []) {
      try { listener(event.data.params); } catch { /* The control intentionally isolates listeners. */ }
    }
  });
  return {
    on(method, listener) { events.set(method, [...(events.get(method) ?? []), listener]); },
    dispose() {},
  };
}

async function main(args) {
  const command = args[0] ?? 'demo';
  const langAt = args.indexOf('--lang');
  const lang = langAt >= 0 ? args[langAt + 1] : 'en';
  if (!copy[lang] || !['demo', 'check', 'compare'].includes(command)) {
    process.stderr.write(`${copy.en.usage}\n`);
    process.exitCode = 2;
    return;
  }
  const result = await probe();
  const control = command === 'compare' ? await probe(isolatedControlTransport) : undefined;
  if (args.includes('--json')) process.stdout.write(`${JSON.stringify({ sdk: '@openai/mcp-extensions@0.1.0', ...result, ...(control ? { control } : {}) })}\n`);
  else {
    process.stdout.write(`${copy[lang].title}\n`);
    process.stdout.write(`${copy[lang].failed}\n`);
    process.stdout.write(`${result.secondReceived ? copy[lang].good : copy[lang].bad}\n`);
    if (control) process.stdout.write(`${copy[lang].comparison}\n`);
  }
  if (command === 'check' && !result.isolated) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main(process.argv.slice(2)).catch(error => { process.stderr.write(`${error.message}\n`); process.exitCode = 2; });
}
