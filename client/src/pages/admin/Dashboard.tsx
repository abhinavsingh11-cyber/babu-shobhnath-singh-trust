import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { Link, Redirect } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Calendar, BookOpen, Users } from 'lucide-react';
import type { Event, Blog, Poetry, User } from '@shared/schema';

export default function AdminDashboard() {
  const { user, isLoading: authLoading, isAdmin } = useAuth();
  const { t } = useLanguage();

  const { data: events } = useQuery<Event[]>({
    queryKey: ['/api/admin/events'],
    enabled: !!isAdmin,
  });

  const { data: blogs } = useQuery<Blog[]>({
    queryKey: ['/api/admin/blogs'],
    enabled: !!isAdmin,
  });

  const { data: poetry } = useQuery<Poetry[]>({
    queryKey: ['/api/admin/poetry'],
    enabled: !!isAdmin,
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    enabled: !!isAdmin && user?.role === 'admin',
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">{t('loading')}</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Redirect to="/" />;
  }

  const stats = [
    {
      title: 'Events',
      value: events?.length || 0,
      icon: Calendar,
      href: '/admin/events',
      color: 'text-blue-600',
    },
    {
      title: 'Blogs',
      value: blogs?.length || 0,
      icon: FileText,
      href: '/admin/blogs',
      color: 'text-green-600',
    },
    {
      title: 'Poetry',
      value: poetry?.length || 0,
      icon: BookOpen,
      href: '/admin/poetry',
      color: 'text-purple-600',
    },
    {
      title: 'Users',
      value: users?.length || 0,
      icon: Users,
      href: '/admin/users',
      color: 'text-orange-600',
      visible: user?.role === 'admin',
    },
  ];

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-2xl text-muted-foreground">
          Welcome back, {user?.firstName || user?.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.filter(stat => stat.visible !== false).map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover-elevate cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total {stat.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Latest events published</CardDescription>
          </CardHeader>
          <CardContent>
            {events && events.length > 0 ? (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-base font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No events yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Blogs</CardTitle>
            <CardDescription>Latest blog posts</CardDescription>
          </CardHeader>
          <CardContent>
            {blogs && blogs.length > 0 ? (
              <div className="space-y-4">
                {blogs.slice(0, 5).map((blog) => (
                  <div key={blog.id} className="flex items-center gap-4">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-base font-medium">{blog.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {blog.author}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No blogs yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
