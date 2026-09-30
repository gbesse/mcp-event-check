# MCP Event Check

**Compruebe si un listener MCP que falla impide que el siguiente reciba su evento.**

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md)

## Proyectos relacionados

- [OpenAI MCP Extensions](https://github.com/openai/mcp-extensions) — El transporte probado se importa de este paquete npm.
- [Issue #13](https://github.com/openai/mcp-extensions/issues/13) — Describe el fallo de aislamiento que reproduce esta herramienta.
- [agent-tools-check](https://github.com/gbesse/agent-tools-check) — Comprueba el descubrimiento y la invocación de herramientas; este repositorio prueba las notificaciones de la aplicación.

Estos enlaces describen proyectos relacionados, sin afiliación.

## Probar

```sh
npm ci
node bin/mcp-event-check.js demo --lang es
```

## Qué comprueba esta herramienta

Inyecta una notificación con dos listeners en el transporte publicado `@openai/mcp-extensions@0.1.0`. `demo` muestra el resultado; `check` devuelve código 1 si los listeners no están aislados.

## Usar con sus datos

```sh
node bin/mcp-event-check.js check --lang es --json
```

Ejecute `check` después de actualizar el SDK. La versión publicada bloquea el segundo listener en esta prueba. No requiere cuenta ni clave API.

## Alcance y límites

Prueba del transporte dentro del proceso con un evento de navegador simulado. No prueba la instalación en ChatGPT ni todos los métodos MCP.

## Pruebas

```sh
npm test
```

MIT · v0.1.0-alpha.1
