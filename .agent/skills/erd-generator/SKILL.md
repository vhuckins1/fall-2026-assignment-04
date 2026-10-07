---
name : erd-generator
description: Designs database schemas as Mermaid entity relationship diagrams and renders them to SVG. Use when the user asks to design an ERD, data model, or architecture diagram.
---

# ERD Generator

Converts domain requirements into a validated Mermaid ERD and renders it to SVG.

## Workflow

1. **Model the domain.** From the requirements, identify:
   - Entities (tables)
   - Attributes for each entity, marking primary keys with `PK` and foreign keys with `FK`
   - Relationships and their cardinalities (one-to-one, one-to-many, many-to-many)

2. **Write the diagram.** Write the Mermaid `erDiagram` syntax to `docs/architecture/schema.mmd`, creating the folder if needed.

3. **Render and validate.** From the project root, run:
   `node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd`

4. **Self-correct on failure.** If the output starts with `SYNTAX_ERROR:`:
   - Read the error trace to find the problem (line number, bad token, etc.)
   - Fix the syntax in `docs/architecture/schema.mmd`
   - Re-run the command in step 3
   - Retry up to 3 times. If it still fails, stop and show the user the last error.

5. **Present the result.** When the script prints `SUCCESS`:
   - Show the user the final Mermaid code in a ```mermaid code block
   - Tell them the diagram was saved to `docs/architecture/erd.svg`