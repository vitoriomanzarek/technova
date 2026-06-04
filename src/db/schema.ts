import { pgTable, serial, uuid, text, varchar, timestamp, json, numeric, integer } from "drizzle-orm/pg-core";

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
  message: text('message'),
  website_url: text('website_url'),
  project_type: varchar('project_type', { length: 255 }),
  created_at: timestamp('created_at').defaultNow(),
});

export const audits = pgTable('audits', {
  id: uuid('id').primaryKey().defaultRandom(),
  lead_id: integer('lead_id').notNull().references(() => leads.id),
  site_url: text('site_url').notNull(),
  score: integer('score').notNull(),
  findings: json('findings').notNull().$type<object[]>(),
  summary: text('summary').notNull(),
  priority_areas: json('priority_areas').notNull().$type<string[]>(),
  extracted_data: json('extracted_data'),
  status: varchar('status', { length: 32 }).notNull().default('completed'),
  error_message: text('error_message'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Stripe Checkout orders. status flow: pending → paid | expired | refunded | disputed.
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  stripe_session_id: varchar('stripe_session_id', { length: 255 }).notNull().unique(),
  stripe_payment_intent_id: varchar('stripe_payment_intent_id', { length: 255 }),
  customer_email: varchar('customer_email', { length: 255 }).notNull(),
  amount_cents: integer('amount_cents').notNull(),
  currency: varchar('currency', { length: 3 }).notNull().default('mxn'),
  description: text('description'),
  status: varchar('status', { length: 32 }).notNull().default('pending'),
  created_at: timestamp('created_at').defaultNow(),
  paid_at: timestamp('paid_at'),
});
