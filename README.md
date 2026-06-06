# Quiniela 26

Quiniela del Mundial 2026 entre amigos. Una sola cuenta de organizador
registra los pronósticos de cada participante y los resultados de cada
partido; los puntos se calculan solos.

## Puntos

- Acertar ganador (no empate) → **1**
- Acertar empate → **2**
- Marcador exacto → **+3** sobre los puntos del resultado

Desempate: más marcadores exactos; si persiste, gana quien tenga la suma
de goles pronosticados más cercana al total oficial de goles de la fase
de grupos (lo decide el organizador). Los horarios se muestran en hora
de Venezuela (GMT-4).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind 4 · Postgres 17 · Docker
Compose. La autenticación del organizador es un único usuario en
`.env.local`.

## Primer arranque

```bash
cp .env.local.example .env.local
# Editar .env.local: cambiar MANAGER_PASSWORD, SESSION_SECRET y
# POSTGRES_PASSWORD (DATABASE_URL usa la misma contraseña).

docker compose up -d --build
```

La app queda en `http://localhost:3000`. Los 72 partidos de la fase de
grupos se siembran automáticamente desde `data/fixtures.json` la primera
vez que la base de datos arranca.

## Comandos útiles

| Comando | Qué hace |
| --- | --- |
| `pnpm reset-db` | Borra participantes, predicciones y resultados; reinicia la app para re-sembrar los partidos. `-- -y` para saltar la confirmación. |
| `pnpm gen-fixtures` | Regenera `data/fixtures.json` desde el calendario en `scripts/gen-fixtures.mjs`. Útil si FIFA cambia un horario. |
| `docker compose logs -f app` | Logs en vivo de la app. |
| `docker compose exec db psql -U $POSTGRES_USER -d $POSTGRES_DB` | Acceso a `psql` para inspección manual. |

## Despliegue

Mismo flujo: `docker compose up -d --build` en el servidor, detrás de tu
proxy / Cloudflare. La base de datos vive en el volumen
`quiniela_pgdata`. Backup:

```bash
docker compose exec db pg_dump -U $POSTGRES_USER $POSTGRES_DB > backup.sql
```
