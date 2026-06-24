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

## Docker Deployment

CookTogether is optimized for Docker deployment, especially on low-power devices like Raspberry Pi.

### Using Docker Compose

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cooktogether.git
   cd cooktogether
   ```

2. Start the application:
   ```bash
   docker-compose up -d
   ```

The application will be available at port `4321`. Your recipes should be placed in the `./recipes` directory to be detected automatically.

### Portainer Deployment & Environment Variables

To deploy via Portainer:
1. Go to **Stacks** > **Add stack**.
2. Paste the content of `docker-compose.yml` into the editor.
3. **Environment Variables**: Portainer allows you to define variables in the "Environment variables" section below the editor. You can use these variables in your `docker-compose.yml` (e.g., `${RECIPES_PATH}`).
4. **Volumes**: If you are using a shared volume or a specific path on your host, it is recommended to use an absolute path:
   ```yaml
   volumes:
     - ${RECIPES_PATH}:/app/recipes
   ```

## License

MIT
