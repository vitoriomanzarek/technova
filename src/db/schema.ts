import { pgTable, serial, text, varchar, timestamp, json, numeric } from "drizzle-orm/pg-core";

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  price: numeric('price').notNull(),
  features: json('features').notNull(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  project_type: varchar('project_type', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
});
