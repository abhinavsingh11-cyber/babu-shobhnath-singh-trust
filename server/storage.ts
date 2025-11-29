import {
  users,
  events,
  blogs,
  poetry,
  type User,
  type UpsertUser,
  type Event,
  type InsertEvent,
  type Blog,
  type InsertBlog,
  type Poetry,
  type InsertPoetry,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, like } from "drizzle-orm";

export interface IStorage {
  // User operations
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User>;
  updateWhatsappOptIn(id: string, optIn: boolean): Promise<User>;
  
  // Event operations
  getAllEvents(published?: boolean): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  getEventsByCategory(category: string): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<void>;
  searchEvents(query: string): Promise<Event[]>;
  
  // Blog operations
  getAllBlogs(published?: boolean): Promise<Blog[]>;
  getBlogById(id: string): Promise<Blog | undefined>;
  getBlogsByCategory(category: string): Promise<Blog[]>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: string, blog: Partial<InsertBlog>): Promise<Blog>;
  deleteBlog(id: string): Promise<void>;
  searchBlogs(query: string): Promise<Blog[]>;
  
  // Poetry operations
  getAllPoetry(published?: boolean): Promise<Poetry[]>;
  getPoetryById(id: string): Promise<Poetry | undefined>;
  createPoetry(poem: InsertPoetry): Promise<Poetry>;
  updatePoetry(id: string, poem: Partial<InsertPoetry>): Promise<Poetry>;
  deletePoetry(id: string): Promise<void>;
  searchPoetry(query: string): Promise<Poetry[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateWhatsappOptIn(id: string, optIn: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ whatsappOptIn: optIn, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Event operations
  async getAllEvents(published?: boolean): Promise<Event[]> {
    const query = published !== undefined
      ? db.select().from(events).where(eq(events.published, published)).orderBy(desc(events.createdAt))
      : db.select().from(events).orderBy(desc(events.createdAt));
    return await query;
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    return await db
      .select()
      .from(events)
      .where(and(eq(events.category, category), eq(events.published, true)))
      .orderBy(desc(events.createdAt));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event> {
    const [event] = await db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return event;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async searchEvents(query: string): Promise<Event[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(events)
      .where(
        and(
          eq(events.published, true),
          or(
            like(events.title, searchPattern),
            like(events.titleHi, searchPattern),
            like(events.description, searchPattern),
            like(events.descriptionHi, searchPattern)
          )
        )
      )
      .orderBy(desc(events.createdAt));
  }

  // Blog operations
  async getAllBlogs(published?: boolean): Promise<Blog[]> {
    const query = published !== undefined
      ? db.select().from(blogs).where(eq(blogs.published, published)).orderBy(desc(blogs.createdAt))
      : db.select().from(blogs).orderBy(desc(blogs.createdAt));
    return await query;
  }

  async getBlogById(id: string): Promise<Blog | undefined> {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    return blog;
  }

  async getBlogsByCategory(category: string): Promise<Blog[]> {
    return await db
      .select()
      .from(blogs)
      .where(and(eq(blogs.category, category), eq(blogs.published, true)))
      .orderBy(desc(blogs.createdAt));
  }

  async createBlog(blog: InsertBlog): Promise<Blog> {
    const [newBlog] = await db.insert(blogs).values(blog).returning();
    return newBlog;
  }

  async updateBlog(id: string, blogData: Partial<InsertBlog>): Promise<Blog> {
    const [blog] = await db
      .update(blogs)
      .set({ ...blogData, updatedAt: new Date() })
      .where(eq(blogs.id, id))
      .returning();
    return blog;
  }

  async deleteBlog(id: string): Promise<void> {
    await db.delete(blogs).where(eq(blogs.id, id));
  }

  async searchBlogs(query: string): Promise<Blog[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(blogs)
      .where(
        and(
          eq(blogs.published, true),
          or(
            like(blogs.title, searchPattern),
            like(blogs.titleHi, searchPattern),
            like(blogs.content, searchPattern),
            like(blogs.contentHi, searchPattern)
          )
        )
      )
      .orderBy(desc(blogs.createdAt));
  }

  // Poetry operations
  async getAllPoetry(published?: boolean): Promise<Poetry[]> {
    const query = published !== undefined
      ? db.select().from(poetry).where(eq(poetry.published, published)).orderBy(desc(poetry.createdAt))
      : db.select().from(poetry).orderBy(desc(poetry.createdAt));
    return await query;
  }

  async getPoetryById(id: string): Promise<Poetry | undefined> {
    const [poem] = await db.select().from(poetry).where(eq(poetry.id, id));
    return poem;
  }

  async createPoetry(poem: InsertPoetry): Promise<Poetry> {
    const [newPoem] = await db.insert(poetry).values(poem).returning();
    return newPoem;
  }

  async updatePoetry(id: string, poemData: Partial<InsertPoetry>): Promise<Poetry> {
    const [poem] = await db
      .update(poetry)
      .set({ ...poemData, updatedAt: new Date() })
      .where(eq(poetry.id, id))
      .returning();
    return poem;
  }

  async deletePoetry(id: string): Promise<void> {
    await db.delete(poetry).where(eq(poetry.id, id));
  }

  async searchPoetry(query: string): Promise<Poetry[]> {
    const searchPattern = `%${query}%`;
    return await db
      .select()
      .from(poetry)
      .where(
        and(
          eq(poetry.published, true),
          or(
            like(poetry.title, searchPattern),
            like(poetry.titleHi, searchPattern),
            like(poetry.content, searchPattern),
            like(poetry.contentHi, searchPattern),
            like(poetry.author, searchPattern),
            like(poetry.authorHi, searchPattern)
          )
        )
      )
      .orderBy(desc(poetry.createdAt));
  }
}

export const storage = new DatabaseStorage();
