# Site Amenities Configurator

A minimal React + Vite + React Three Fiber scaffold to plan site amenities. Built to avoid common three/drei version mismatches that cause errors like:

Cannot read properties of undefined (reading 'source')

Key choices:
- Pin mutually compatible versions of three, @react-three/fiber, and @react-three/drei.
- Avoid textures and components that internally create images/fonts (HDRI, Text, sprites, etc.).
- No TransformControls; stable plane-drag with null guards.

## Scripts
- dev: start Vite dev server
- build: production build
- test: run Vitest unit tests

## Quick start
1) Install dependencies
	npm install

2) Run the app
	npm run dev

3) Run tests
	npm run test

Open http://localhost:5173 (default) if the browser doesn't open automatically.

## Troubleshooting: reading 'source'
1) Ensure a single three is installed
	npm ls three
	# Expect exactly one entry; if duplicates, remove lockfile and node_modules then reinstall
	rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock
	npm install

2) Keep the pinned versions in package.json as provided.

3) Avoid using drei components that load textures or fonts unless you align versions carefully.

## Notes
- Hotkeys: R rotate, C clone, Del delete, G grid size.
- Cart preview supports generic, shopify, and stripe payload shapes.