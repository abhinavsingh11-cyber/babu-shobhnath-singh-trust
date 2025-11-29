import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation, Redirect } from 'wouter';
import { Calendar, FileText, BookOpen, Users, LayoutDashboard, LogOut, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, isAdmin } = useAuth();
  const { t } = useLanguage();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Events', href: '/admin/events', icon: Calendar },
    { name: 'Blogs', href: '/admin/blogs', icon: FileText },
    { name: 'Poetry', href: '/admin/poetry', icon: BookOpen },
    ...(user?.role === 'admin' ? [{ name: 'Users', href: '/admin/users', icon: Users }] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return location === href;
    }
    return location.startsWith(href);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Admin Portal</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {user?.firstName || user?.email}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'hover-elevate'
                  }`}
                  data-testid={`link-admin-${item.name.toLowerCase()}`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Link href="/">
            <Button variant="outline" className="w-full justify-start" data-testid="link-back-to-site">
              <Home className="h-5 w-5 mr-2" />
              Back to Site
            </Button>
          </Link>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.location.href = '/api/logout'}
            data-testid="button-admin-logout"
          >
            <LogOut className="h-5 w-5 mr-2" />
            {t('logout')}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
