# askui UI Automation Actor v2 (Apify Actor, TypeScript)

Runs natural-language UI instructions via the askui vision agent inside a
headless desktop (Xvfb + fluxbox in the Actor container).

## v2 changes

- Fixed `.actor/actor.json` (`building` -> `buildTag`, real name `mpelas-actor-askui-apify-actor-v2`,
  version 2.0, input/output/dataset schema wiring, generatedBy)
- Input validation and status message on completion
- Pay-per-event monetization: one `instruction_executed` event charged per
  instruction (`Actor.charge({ eventName: 'instruction_executed', count: 1 })`)
- Cleaned scripts/dist/node_modules clutter from the source tree

## Input

```json
{
  "instructions": ["Click on the button with text 'Submit'"],
  "screenshotOnError": true
}
```

## Pricing (pay per event)

`instruction_executed` (primary) — **$0.005 per instruction**.

## Run locally

```bash
npm install
npm run build
npm start
```

## Deploy

```bash
apify push
```
