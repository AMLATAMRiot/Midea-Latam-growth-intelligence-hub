# Midea Regional Growth Intelligence Hub

Interactive strategic presentation website built as a premium React microsite with Tailwind styling, subtle motion, and chart-driven sections.

## Files

- `index.html`: app shell and Tailwind theme setup
- `src/main.js`: React components, charts, motion, and section logic
- `src/styles.css`: custom visual system and layout polish
- `src/data/mideaData.json`: editable Q1 inputs plus modeled cluster planning data

## Run locally

Serve the folder with any static server so the app can fetch `src/data/mideaData.json`.

Using the bundled Python runtime from Codex:

```powershell
C:\Users\danie\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe -m http.server 4173
```

Then open:

```text
http://localhost:4173
```

## Notes

- Q1 market signals are based on the supplied Midea CSV/JSON files.
- Ecuador and Venezuela are intentionally modeled as editable planning assumptions inside `src/data/mideaData.json`.
- The experience is structured as a decision-making hub rather than a traditional slide deck.
