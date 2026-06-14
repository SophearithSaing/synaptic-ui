# Project: Synaptic

**Goal:** Interactive AI-driven education platform for computing theory.
**Status:** Multi-repo Architecture.

## Technical Constraints

- **Frontend:** Angular 18+, SCSS (Custom Styles only, NO Tailwind).
- **Backend:** NestJS, Node.js.
- **Database:** MongoDB (Mongoose).
- **State:** Angular Signals for reactive UI (Progress Bar, Question State).

## UI/UX Direction

- **Branding:** Minimalist, academic, interactive.
- **Componentry:** Custom SCSS modules. Focus on high-quality typography and transitions.
- **Interaction:** No chat bubbles. Question-based cards with $0 \rightarrow 100$ progress tracking.

## Code Style

- **Indentation:** 2 spaces (no tabs).
- **Quotes:** Use single quotes `'` for strings unless double quotes are required for JSON.
- **Line Width:** Keep code blocks under 80 characters per line where possible.
- **Comment:** Every function MUST have a return type and TS Doc header. Body comments are forbidden, except for complex algorithmic logic in long functions or non-obvious workarounds for third-party bugs.

### TypeScript

- **Strictness:** Strictly adhere to the project's `tsconfig.json`. Never use `any`; use `unknown` if the type is truly unknown.
- **Null Safety:** Avoid non-null assertions (`!`). Use optional chaining (`?.`) or explicit null checks to handle potentially null or undefined values.
- **Class Members:** Use explicit visibility modifiers (`public`, `private`, `protected`) for all class members.
- **Overrides:** Always use the `override` keyword when overriding base class methods (required by `noImplicitOverride`).
- **Return Types:** Ensure all code paths return a value (required by `noImplicitReturns`).
- **Switch Cases:** Avoid fall-through cases in switch statements (required by `noFallthroughCasesInSwitch`).
- **Index Signatures:** Use bracket notation for property access from index signatures (required by `noPropertyAccessFromIndexSignature`).
- **Templates:** Ensure all templates are compatible with `strictTemplates` (Angular).
- **State:** Use Angular Signals for all reactive UI state. Avoid `BehaviorSubject` unless strictly necessary for legacy integration.
- **TS Doc Format:** Include `@param` for each parameter and `@returns` only when the function returns a value. Do not write `@returns Nothing.` for `void` functions.

```ts
/**
 * Finds a topic by id.
 *
 * @param topicId Topic id to find.
 * @returns Matching topic, or null when no topic exists.
 */
private findTopic(topicId: string): Topic | null {
  return null;
}

/**
 * Clears the active session.
 */
public signOut(): void {
  this.accessToken.set(null);
}
```

## Environment

- **Shell:** PowerShell. Use PowerShell-compatible syntax (e.g., `;` instead of `&&` for command chaining).
- **Command Preference:** Use PowerShell-native commands first for filesystem, search, and text inspection tasks (e.g., `Get-ChildItem`, `Get-Content`, `Select-String`) before trying Unix-style tools.
- **Verification:** Prefer `npm.cmd run build` for local verification. Do not run `ng serve`; ask the user to verify browser/dev-server behavior instead.
- **Formatting Timing:** Do not run Prettier after every small change. Run `npx prettier --write` only before committing code.

## Plan Guidelines

- When in Plan Mode, focus on implementing requested changes as defined by the approved plan.
- Implement the requested changes and verify them (e.g., via local build), but **do not** stage, commit, or create a Pull Request for these changes until you receive an explicit directive from the user to do so.
- After implementing and verifying, summarize the completed work and await further instructions.

## Commit Standards

- **Formatting:** Edited files must be formatted with `npx prettier --write` before any commit.
- **Atomic Commits:** Separate changes into multiple logical commits. Avoid bulk commits of unrelated changes.
- **Message Quality:** Use meaningful and descriptive commit messages that explain the "why" and "what".
- **Formatting Rules:**
  - Commit messages must start with a capitalized word.
  - Do not use prefixes like 'Fix:', 'Enhancement:', or 'feat:'.
  - Avoid vague messages like "Address comments", "Small fixes", or "Update files".
