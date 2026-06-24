# README.md

# CookTogether

CookTogether is an open-source, self-hosted recipe viewer built on top of the Cooklang ecosystem.

The project uses Cooklang files as the source of truth and focuses on improving the cooking experience rather than replacing existing editors.

## Why?

Many recipe applications focus on storing recipes.

CookTogether focuses on using them.

The project aims to answer questions such as:

* How can a recipe be easier to follow while cooking?
* How can two people cook together efficiently?
* How can optional ingredients be represented clearly?
* How can progress be tracked during cooking sessions?

CookTogether does not attempt to replace Cooklang.

Instead, it extends the cooking experience while remaining fully compatible with existing Cooklang tools.

## Principles

### Cooklang First

Recipes remain standard `.cook` files.

No proprietary format.

Users can continue using their preferred Cooklang editor.

### Self Hosted

The application is designed to run on personal infrastructure, including Raspberry Pi devices.

### Open Source

The entire project is developed in the open.

### Read Only

CookTogether is initially a viewer.

Recipe creation and editing remain the responsibility of external tools such as CookCLI.

## Initial Architecture

```text
CookCLI
    |
    v
Cooklang Files (.cook)
    |
    v
CookTogether
```

The same recipe directory can be shared between CookCLI and CookTogether.

## Roadmap

### MVP 1 — Recipe Browser

* Discover recipes from filesystem
* Browse categories
* Open and display recipes
* Docker deployment
* Responsive interface

### MVP 2 — Cooking Mode

* Step-by-step mode
* Progress tracking
* Large touch-friendly controls
* Persist progress locally

### MVP 3 — Optional Ingredients

* Dedicated optional ingredient section
* Cooklang-compatible metadata support
* Improved ingredient display

### MVP 4 — Cook Together

* Assign steps to participants
* Visual separation of responsibilities
* Shared cooking workflow

### Maybe later — Equipment & Mise en Place

* Equipment checklist
* Preparation checklist
* Better kitchen workflow

## License

MIT
