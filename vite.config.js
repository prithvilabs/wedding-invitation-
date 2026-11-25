import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { SPECIAL_DAYS } from './src/data/specialDays.js';
import { icsFile, icsPath } from './src/sections/events/calendarLinks.js';

/** Writes one .ics calendar file per celebration, from the same data the page uses */
function calendarFiles() {
  return {
    name: 'wedding-calendar-files',
    generateBundle() {
      SPECIAL_DAYS.forEach((event) => {
        this.emitFile({ type: 'asset', fileName: icsPath(event), source: icsFile(event) });
      });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const event = SPECIAL_DAYS.find((e) => req.url?.split('?')[0].endsWith(`/${icsPath(e)}`));
        if (!event) return next();
        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.end(icsFile(event));
      });
    }
  };
}

export default defineConfig({
  base: '/wedding-invitation-/',
  plugins: [react(), calendarFiles()],
  server: {
    port: 3000,
    host: true
  }
});
