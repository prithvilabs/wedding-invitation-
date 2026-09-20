# Design Implementation Workflow

This project is set up for a reference-image-driven design workflow:

```
REFERENCE IMAGE / SCREENSHOT
  -> IMAGE-TO-CODE        (ux-ui-agent-skills:image-to-code)
  -> WEB DESIGN GUIDELINES + AWESOME DESIGN
       (web-design-guidelines skill, ux-ui-agent-skills design-systems/apply-aesthetic)
  -> TASK TRACKING        (built-in Task tools)
  -> IMPLEMENTATION
  -> PLAYWRIGHT           (@playwright/mcp, tests/e2e)
  -> VISUAL + FUNCTIONAL VERIFICATION
  -> ITERATE
```

## Capabilities and where they live

| Capability | Source | Scope |
|---|---|---|
| Image-to-Code | `image-to-code` skill, part of the `ux-ui-agent-skills` plugin ([plugin87/ux-ui-agent-skills](https://github.com/plugin87/ux-ui-agent-skills)) | installed globally (user scope) |
| Web Design Guidelines | `.claude/skills/web-design-guidelines/` (from [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)) — audits UI against Vercel's Web Interface Guidelines, fetched fresh from `vercel-labs/web-interface-guidelines` on each run | project-local |
| Awesome Design | Covered by `ux-ui-agent-skills`'s bundled `design-systems/` (138 reference systems), `apply-aesthetic`, and `design-doctrine` skills — not a separately installed repo, to avoid duplicating that reference content. See note below if a broader collection is wanted. | installed globally (user scope) |
| Task tracking | Claude Code's built-in Task tools (TaskCreate/TaskUpdate/TaskGet/TaskList/TaskStop) | built-in, no install |
| Playwright (browser control) | `@playwright/mcp` MCP server, registered in `.mcp.json` | project-local |
| Playwright (test runner) | `@playwright/test` devDependency, `playwright.config.js`, `tests/e2e/` | project-local |

Note on "Awesome Design": the exact literal match for that name is
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md), a
plain collection of `DESIGN.md` reference files (no plugin logic). It was not
installed here because `ux-ui-agent-skills` already ships an overlapping
138-system reference set. If the broader/alternate collection is specifically
wanted, it can be added on request.

## Running the Playwright verification loop

```
npm run dev              # start the app (http://localhost:3000/wedding-invitation-/)
npm run test:e2e         # run tests/e2e/*.spec.js against it (mobile + desktop projects)
```

`playwright.config.js` points `launchOptions.executablePath` at this
environment's pre-installed Chromium (`/opt/pw-browsers/chromium`) rather than
letting Playwright download a version-matched browser, since this sandbox
does not have outbound access for that download. If Playwright is ever run
outside this sandbox, that override can be removed.

The `playwright` MCP server (`@playwright/mcp`) is registered in `.mcp.json`
for interactive browser driving (navigate/click/screenshot as tool calls)
during implementation review; the `@playwright/test` setup above is for
scripted, repeatable checks.
