---
name: kysely-migration-generator

description : Reads the Mermaid erDiagram in docs/architecture/schema.mmd and writes a Kysely migration that creates the matching tables.
---
Translation Rules

Follow these rules exactly.

Entities → Tables. Convert each Mermaid entity name to a snake_case table name (e.g., USERS → users, ORDER_ITEMS → order_items). Column names are also snake_case.
Primary keys. Every PK attribute becomes an auto-generating ID:
Integer IDs: .addColumn('id', 'serial', (col) => col.primaryKey())
UUID IDs: .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sqlgen_random_uuid())) Use UUIDs if the ERD types the key as uuid; otherwise use serial.
Foreign keys. Every FK attribute must reference its parent table's primary key and cascade on delete: .addColumn('user_id', 'integer', (col) => col.references('users.id').onDelete('cascade').notNull()) The FK column's type must match the parent's PK type (integer for serial, uuid for uuid).
Cardinalities.
||--o{ (one-to-many): put the FK column on the "many" side. No unique constraint.
||--o| (one-to-one): put the FK column on the child side AND add .unique() to it, so each parent has at most one child.
File output. Write the migration to src/db/migrations/<timestamp>_<migration_name>.ts:
<timestamp> is the current date and time as YYYYMMDDHHmmss (e.g., 20261007153000).
<migration_name> is a short snake_case description (e.g., create_users_and_posts).
Create the src/db/migrations/ folder if it does not exist.
Structure. The file must:
Import from Kysely: import { Kysely, sql } from 'kysely' (include sql only if UUIDs are used).
Export export async function up(db: Kysely<any>): Promise<void>, which creates parent tables before the tables that reference them.
Export export async function down(db: Kysely<any>): Promise<void>, which drops tables in reverse dependency order: children first, parents last.