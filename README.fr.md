# MCP Event Check

**Vérifiez si un listener MCP qui plante empêche le suivant de recevoir son événement.**

[English](README.md) · [Français](README.fr.md) · [Español](README.es.md)

## Projets voisins

- [OpenAI MCP Extensions](https://github.com/openai/mcp-extensions) — Le transport testé est importé de ce paquet npm.
- [Issue #13](https://github.com/openai/mcp-extensions/issues/13) — Signale la panne d’isolation reproduite par cet outil.
- [agent-tools-check](https://github.com/gbesse/agent-tools-check) — Vérifie la découverte et l’appel des outils ; ce dépôt vérifie les notifications de l’application.

Ces liens décrivent des projets voisins, sans affiliation.

Exécutez `node bin/mcp-event-check.js compare --lang fr --json` pour comparer le SDK publié à un transport témoin isolé avec la même notification injectée. Le témoin est synthétique et ne prouve pas qu’une version plus récente du SDK est corrigée.

## Essayer

```sh
npm ci
node bin/mcp-event-check.js demo --lang fr
```

## Ce que cet outil vérifie

Injecte une notification avec deux listeners dans le transport publié `@openai/mcp-extensions@0.1.0`. `demo` affiche le résultat ; `check` renvoie le code 1 si les listeners ne sont pas isolés.

## Utiliser avec vos données

```sh
node bin/mcp-event-check.js check --lang fr --json
```

Lancez `check` après une mise à jour du SDK. La version publiée bloque le second listener dans cette fixture. Aucun compte hôte ni clé API.

## Périmètre et limites

Test du transport en processus avec un événement navigateur simulé. Il ne teste ni l’installation d’un plugin ChatGPT ni toutes les méthodes MCP.

## Tests

```sh
npm test
```

MIT · v0.1.1
