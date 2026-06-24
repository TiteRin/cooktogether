# DIRECTIONS.md

# Development Directions

---

# Global Rules

## Development Approach

Follow strict Test Driven Development.

Always:

1. Write a failing test.
2. Execute the test.
3. Implement the minimum code required.
4. Make the test pass.
5. Refactor.
6. Repeat.

Never implement production code without a failing test.

---

# Technical Constraints

* Astro
* TypeScript
* React islands
* Vitest
* Testing Library
* Playwright
* Docker
* No database for MVP stages
* Recipes stored as Cooklang files

---

# Project Structure

```text
src/
  components/
  pages/
  features/
  lib/

tests/
e2e/
recipes/
```

---

# MVP 1 — Recipe Browser

## Goal

Display recipes stored on disk.

## User Story

As a cook,
I want to browse recipes,
So that I can open and read them.

## Step 1

Write tests for filesystem discovery.

Requirements:

* find all .cook files
* ignore other files
* support nested directories

Expected output:

```ts
[
  {
    name: "chili",
    path: "plats/chili.cook"
  }
]
```

## Step 2

Implement recipe discovery service.

## Step 3

Write tests for recipe loading.

Requirements:

* load recipe content
* return metadata
* handle missing files

## Step 4

Implement recipe loader.

## Step 5

Write integration tests for recipe listing page.

## Step 6

Implement recipe listing page.

## Step 7

Write integration tests for recipe detail page.

## Step 8

Implement recipe detail page.

## Completion Criteria

User can:

* browse recipes
* open recipe
* read recipe

---

# MVP 2 — Cooking Mode

## Goal

Track cooking progress.

## User Story

As a cook,
I want to mark steps as completed,
So that I know where I am.

## Step 1

Write tests for progress state.

Requirements:

* step can be completed
* step can be reverted
* progress percentage available

## Step 2

Implement progress state.

## Step 3

Write tests for persistence.

Requirements:

* progress survives refresh
* progress isolated per recipe

## Step 4

Implement persistence.

## Step 5

Write Playwright tests.

Requirements:

* user completes steps
* page refreshes
* state preserved

## Completion Criteria

User can stop and resume cooking.

---

# MVP 3 — Optional Ingredients

## Goal

Separate optional ingredients from required ingredients.

## User Story

As a cook,
I want optional ingredients clearly identified,
So that I know what can be skipped.

## Step 1

Define metadata format.

Example:

```yaml
---
optional:
  - parmesan
  - chili flakes
---
```

## Step 2

Write parser tests.

## Step 3

Implement metadata extraction.

## Step 4

Write UI tests.

## Step 5

Implement ingredient grouping.

## Completion Criteria

Optional ingredients appear in a dedicated section.

---

# MVP 4 — Cook Together

## Goal

Split recipe execution between participants.

## User Story

As two cooks,
We want assigned tasks,
So that we can coordinate.

## Step 1

Define participant syntax.

Example:

```text
[A]
Prepare vegetables

[B]
Prepare sauce

[BOTH]
Assemble
```

## Step 2

Write parser tests.

## Step 3

Implement participant extraction.

## Step 4

Write UI tests.

## Step 5

Implement participant views.

## Completion Criteria

Users can identify their assigned tasks.
