import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminLayout from "@/components/AdminLayout";
import Home from "@/pages/Home";
import Events from "@/pages/Events";
import Blogs from "@/pages/Blogs";
import PoetryPage from "@/pages/Poetry";
import EventDetail from "@/pages/EventDetail";
import BlogDetail from "@/pages/BlogDetail";
import PoetryDetail from "@/pages/PoetryDetail";
import About from "@/pages/About";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminEvents from "@/pages/admin/Events";
import AdminBlogs from "@/pages/admin/Blogs";
import AdminPoetry from "@/pages/admin/Poetry";
import AdminUsers from "@/pages/admin/Users";
import EventForm from "@/pages/admin/EventForm";
import BlogForm from "@/pages/admin/BlogForm";
import PoetryForm from "@/pages/admin/PoetryForm";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/events" component={AdminEvents} />
          <Route path="/admin/events/new" component={EventForm} />
          <Route path="/admin/events/:id/edit" component={EventForm} />
          <Route path="/admin/blogs" component={AdminBlogs} />
          <Route path="/admin/blogs/new" component={BlogForm} />
          <Route path="/admin/blogs/:id/edit" component={BlogForm} />
          <Route path="/admin/poetry" component={AdminPoetry} />
          <Route path="/admin/poetry/new" component={PoetryForm} />
          <Route path="/admin/poetry/:id/edit" component={PoetryForm} />
          <Route path="/admin/users" component={AdminUsers} />
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/events" component={Events} />
          <Route path="/events/:id" component={EventDetail} />
          <Route path="/blogs" component={Blogs} />
          <Route path="/blogs/:id" component={BlogDetail} />
          <Route path="/poetry" component={PoetryPage} />
          <Route path="/poetry/:id" component={PoetryDetail} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <LanguageProvider>
            <ErrorBoundary>
              <Router />
            </ErrorBoundary>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
