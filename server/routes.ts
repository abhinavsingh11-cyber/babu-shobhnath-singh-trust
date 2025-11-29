import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import logger from "./logger";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertEventSchema, insertBlogSchema, insertPoetrySchema } from "@shared/schema";
import { upload } from "./upload";
import { z } from "zod";

// Rate limiters for different API endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: { message: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Stricter limit for auth endpoints
  message: { message: "Too many authentication attempts. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Moderate limit for admin endpoints
  message: { message: "Too many admin requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit uploads to 20 per hour
  message: { message: "Upload limit reached. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply rate limiting BEFORE routes are registered
  // This ensures rate limits apply to all routes including auth
  app.use('/api/', generalLimiter);
  app.use('/api/login', authLimiter);
  app.use('/api/auth', authLimiter);
  app.use('/api/admin/', adminLimiter);
  app.use('/api/admin/upload', uploadLimiter);

  // Auth middleware - must come AFTER rate limiting
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      logger.error("Error fetching user", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.patch('/api/user/whatsapp-opt-in', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const schema = z.object({ optIn: z.boolean() });
      const validated = schema.parse(req.body);
      const user = await storage.updateWhatsappOptIn(userId, validated.optIn);
      res.json(user);
    } catch (error: any) {
      logger.error("Error updating WhatsApp opt-in", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to update preference" });
    }
  });

  // Event routes - public
  app.get('/api/events', async (_req, res) => {
    try {
      const events = await storage.getAllEvents(true);
      res.json(events);
    } catch (error) {
      logger.error("Error fetching events", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/:id', async (req, res) => {
    try {
      const event = await storage.getEventById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      logger.error("Error fetching event", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });

  app.get('/api/events/category/:category', async (req, res) => {
    try {
      const events = await storage.getEventsByCategory(req.params.category);
      res.json(events);
    } catch (error) {
      logger.error("Error fetching events by category", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  app.get('/api/events/search/:query', async (req, res) => {
    try {
      const events = await storage.searchEvents(req.params.query);
      res.json(events);
    } catch (error) {
      logger.error("Error searching events", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to search events" });
    }
  });

  // Event routes - admin
  app.post('/api/admin/events', isAdmin, async (req: any, res) => {
    try {
      const validated = insertEventSchema.parse(req.body);
      const userId = req.user.claims.sub;
      const event = await storage.createEvent({ ...validated, createdBy: userId });
      res.json(event);
    } catch (error: any) {
      logger.error("Error creating event", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to create event" });
    }
  });

  app.patch('/api/admin/events/:id', isAdmin, async (req, res) => {
    try {
      const validated = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(req.params.id, validated);
      res.json(event);
    } catch (error: any) {
      logger.error("Error updating event", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to update event" });
    }
  });

  app.delete('/api/admin/events/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteEvent(req.params.id);
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      logger.error("Error deleting event", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to delete event" });
    }
  });

  app.get('/api/admin/events', isAdmin, async (_req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json(events);
    } catch (error) {
      logger.error("Error fetching all events", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });

  // Blog routes - public
  app.get('/api/blogs', async (_req, res) => {
    try {
      const blogs = await storage.getAllBlogs(true);
      res.json(blogs);
    } catch (error) {
      logger.error("Error fetching blogs", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get('/api/blogs/:id', async (req, res) => {
    try {
      const blog = await storage.getBlogById(req.params.id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.json(blog);
    } catch (error) {
      logger.error("Error fetching blog", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch blog" });
    }
  });

  app.get('/api/blogs/category/:category', async (req, res) => {
    try {
      const blogs = await storage.getBlogsByCategory(req.params.category);
      res.json(blogs);
    } catch (error) {
      logger.error("Error fetching blogs by category", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  app.get('/api/blogs/search/:query', async (req, res) => {
    try {
      const blogs = await storage.searchBlogs(req.params.query);
      res.json(blogs);
    } catch (error) {
      logger.error("Error searching blogs", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to search blogs" });
    }
  });

  // Blog routes - admin
  app.post('/api/admin/blogs', isAdmin, async (req: any, res) => {
    try {
      const validated = insertBlogSchema.parse(req.body);
      const userId = req.user.claims.sub;
      const blog = await storage.createBlog({ ...validated, createdBy: userId });
      res.json(blog);
    } catch (error: any) {
      logger.error("Error creating blog", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to create blog" });
    }
  });

  app.patch('/api/admin/blogs/:id', isAdmin, async (req, res) => {
    try {
      const validated = insertBlogSchema.partial().parse(req.body);
      const blog = await storage.updateBlog(req.params.id, validated);
      res.json(blog);
    } catch (error: any) {
      logger.error("Error updating blog", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to update blog" });
    }
  });

  app.delete('/api/admin/blogs/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteBlog(req.params.id);
      res.json({ message: "Blog deleted successfully" });
    } catch (error) {
      logger.error("Error deleting blog", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to delete blog" });
    }
  });

  app.get('/api/admin/blogs', isAdmin, async (_req, res) => {
    try {
      const blogs = await storage.getAllBlogs();
      res.json(blogs);
    } catch (error) {
      logger.error("Error fetching all blogs", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  });

  // Poetry routes - public
  app.get('/api/poetry', async (_req, res) => {
    try {
      const poetry = await storage.getAllPoetry(true);
      res.json(poetry);
    } catch (error) {
      logger.error("Error fetching poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch poetry" });
    }
  });

  app.get('/api/poetry/:id', async (req, res) => {
    try {
      const poem = await storage.getPoetryById(req.params.id);
      if (!poem) {
        return res.status(404).json({ message: "Poetry not found" });
      }
      res.json(poem);
    } catch (error) {
      logger.error("Error fetching poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch poetry" });
    }
  });

  app.get('/api/poetry/search/:query', async (req, res) => {
    try {
      const poetry = await storage.searchPoetry(req.params.query);
      res.json(poetry);
    } catch (error) {
      logger.error("Error searching poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to search poetry" });
    }
  });

  // Poetry routes - admin
  app.post('/api/admin/poetry', isAdmin, async (req: any, res) => {
    try {
      const validated = insertPoetrySchema.parse(req.body);
      const userId = req.user.claims.sub;
      const poetry = await storage.createPoetry({ ...validated, createdBy: userId });
      res.json(poetry);
    } catch (error: any) {
      logger.error("Error creating poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to create poetry" });
    }
  });

  app.patch('/api/admin/poetry/:id', isAdmin, async (req, res) => {
    try {
      const validated = insertPoetrySchema.partial().parse(req.body);
      const poetry = await storage.updatePoetry(req.params.id, validated);
      res.json(poetry);
    } catch (error: any) {
      logger.error("Error updating poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to update poetry" });
    }
  });

  app.delete('/api/admin/poetry/:id', isAdmin, async (req, res) => {
    try {
      await storage.deletePoetry(req.params.id);
      res.json({ message: "Poetry deleted successfully" });
    } catch (error) {
      logger.error("Error deleting poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to delete poetry" });
    }
  });

  app.get('/api/admin/poetry', isAdmin, async (_req, res) => {
    try {
      const poetry = await storage.getAllPoetry();
      res.json(poetry);
    } catch (error) {
      logger.error("Error fetching all poetry", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch poetry" });
    }
  });

  // Admin - user management
  app.get('/api/admin/users', isAdmin, async (_req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      logger.error("Error fetching users", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/users/:id/role', isAdmin, async (req, res) => {
    try {
      const schema = z.object({ 
        role: z.enum(['user', 'admin', 'content_manager']) 
      });
      const validated = schema.parse(req.body);
      const user = await storage.updateUserRole(req.params.id, validated.role);
      res.json(user);
    } catch (error: any) {
      logger.error("Error updating user role", { error: error instanceof Error ? error.message : String(error) });
      res.status(400).json({ message: error.message || "Failed to update user role" });
    }
  });

  // Media upload route
  app.post('/api/admin/upload', isAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const fileUrl = `/attached_assets/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      logger.error("Error uploading file", { error: error instanceof Error ? error.message : String(error) });
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
