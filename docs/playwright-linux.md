# Playwright on Linux (sandbox) configuration

The default setup targets Windows and Playwright's managed browsers. Two things
differ in the Linux sandbox this project was originally set up in.

## 1. Pre-installed Chromium (test runner)

The sandbox ships a pinned Chromium at `/opt/pw-browsers/chromium` and has no
outbound access to run `npx playwright install`. Point the test runner at it
with an env var. No config edit is needed:

```bash
PW_CHROMIUM_PATH=/opt/pw-browsers/chromium npm test
```

`playwright.config.js` sets `launchOptions.executablePath` only when
`PW_CHROMIUM_PATH` is set. Otherwise it uses the managed browser.

On a normal Linux machine with internet access, leave the variable unset and run
`npx playwright install chromium` once.

## 2. Playwright MCP server (`.mcp.json`)

On Windows, `.mcp.json` wraps `npx` in `cmd /c`, which Windows requires to start
stdio MCP servers. `cmd` does not exist on Linux or macOS, so replace the
`playwright` entry with:

```json
"playwright": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@playwright/mcp@latest"],
  "env": {}
}
```

Alternatively, keep the Windows version in the repo and add a user-scoped server
on the Linux machine:
`claude mcp add playwright -- npx -y @playwright/mcp@latest`
