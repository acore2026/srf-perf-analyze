# srf-perf-analyze

Interactive Vite + React dashboard for estimating SRF architecture ROI in a 6G core network. The app compares link-resource savings and proportional PBU_C-A1 footprint reduction using adjustable topology and VM parameters.

## Features

- Micro model for RAM and CPU savings from reduced SCTP/NGAP links.
- Macro model for PBU_C-A1 VM, CPU, RAM, and storage reduction.
- English and Chinese UI copy.
- Responsive Tailwind CSS layout.
- TypeScript React source with a production Docker image.

## Project Structure

- `src/main.tsx`: React entrypoint.
- `src/SRFCalculator.tsx`: dashboard UI, state, translations, and ROI calculations.
- `src/styles.css`: Tailwind and global styles.
- `index.html`: Vite HTML entrypoint.
- `Dockerfile` and `nginx.conf`: production container build and static serving config.
- `from_gemini_canvas.tsx`: archived/reference component variant.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run TypeScript checks only:

```bash
npm run typecheck
```

## Docker

Build the production image:

```bash
docker build -t srf-perf-analyze .
```

Run it locally:

```bash
docker run --rm -p 8080:80 srf-perf-analyze
```
