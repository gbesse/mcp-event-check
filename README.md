# MCP Event Check

**See whether one crashing MCP app listener silences the next one.**

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md)

## Related projects

- [OpenAI MCP Extensions](https://github.com/openai/mcp-extensions) — The transport under test is imported from this npm package.
- [Issue #13](https://github.com/openai/mcp-extensions/issues/13) — Reports the listener isolation failure that this probe reproduces.
- [agent-tools-check](https://github.com/gbesse/agent-tools-check) — Checks tool discovery and invocation; this repository checks app notification listeners.

Links describe technical neighbors, not an affiliation.

## Try it

```sh
npm ci
node bin/mcp-event-check.js demo --lang en
```

## What this checks

Runs an injected two-listener notification against the published `@openai/mcp-extensions@0.1.0` transport. `demo` prints the result; `check` exits 1 when isolation fails, for CI.

Run `node bin/mcp-event-check.js compare --lang en --json` to compare the published SDK against an isolated control transport using the same injected notification. The control is synthetic; it does not assert that a newer SDK is fixed.

## Use with your data

```sh
node bin/mcp-event-check.js check --lang en --json
```

Run `check` after an SDK upgrade. The current published version blocks listener two in this fixture. No host account or API key is needed.

## Scope and limits

This is an in-process transport test with a mock browser message event. It does not exercise ChatGPT plugin installation or every MCP method.

## Tests

```sh
npm test
```

MIT · v0.1.1


## 2026-11-05 — FR / EN / ES

FR : Les appels concurrents de `probe()` sont sérialisés dans ce processus pour ne pas mélanger les faux window de transport. Le window initial est restauré même si dispose échoue ; un échec ne bloque pas la sonde suivante. Test local du SDK, aucun serveur MCP externe ni appel OpenAI.

EN: Concurrent `probe()` calls serialize within this process to avoid mixing transport window fixtures. Original window is restored even if dispose fails; failure does not block the next probe. Local SDK test, no external MCP server or OpenAI call.

ES: Llamadas concurrentes a `probe()` se serializan en el proceso para no mezclar fixtures window. Restaura window original aunque dispose falle; fallo no bloquea siguiente sonda. Prueba local SDK, sin servidor MCP externo ni llamada OpenAI.
