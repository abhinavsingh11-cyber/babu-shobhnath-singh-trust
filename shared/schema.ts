import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - required for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - required for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").notNull().default('user'), // user, admin, content_manager
  whatsappOptIn: boolean("whatsapp_opt_in").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  description: text("description").notNull(),
  descriptionHi: text("description_hi"),
  category: varchar("category").notNull(), // literature, education, culture, social
  date: varchar("date").notNull(),
  location: text("location").notNull(),
  locationHi: text("location_hi"),
  imageUrl: text("image_url"),
  published: boolean("published").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Blogs table
export const blogs = pgTable("blogs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  content: text("content").notNull(),
  contentHi: text("content_hi"),
  excerpt: text("excerpt").notNull(),
  excerptHi: text("excerpt_hi"),
  category: varchar("category").notNull(),
  imageUrl: text("image_url"),
  author: varchar("author").notNull(),
  published: boolean("published").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlogSchema = createInsertSchema(blogs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type Blog = typeof blogs.$inferSelect;

// Poetry table
export const poetry = pgTable("poetry", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  titleHi: text("title_hi"),
  content: text("content").notNull(),
  contentHi: text("content_hi"),
  excerpt: text("excerpt").notNull(),
  excerptHi: text("excerpt_hi"),
  author: varchar("author").notNull(),
  authorHi: varchar("author_hi"),
  imageUrl: text("image_url"),
  published: boolean("published").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPoetrySchema = createInsertSchema(poetry).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPoetry = z.infer<typeof insertPoetrySchema>;
export type Poetry = typeof poetry.$inferSelect;
