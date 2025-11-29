import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Hero from '@/components/Hero';
import EventCard from '@/components/EventCard';
import BlogCard from '@/components/BlogCard';
import PoetryCard from '@/components/PoetryCard';
import CategoryFilter from '@/components/CategoryFilter';
import ErrorState from '@/components/ErrorState';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import type { Event, Blog, Poetry } from '@shared/schema';

export default function Home() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: events = [], isLoading: eventsLoading, isError: eventsError, refetch: refetchEvents } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const { data: blogs = [], isLoading: blogsLoading, isError: blogsError, refetch: refetchBlogs } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });

  const { data: poetry = [], isLoading: poetryLoading, isError: poetryError, refetch: refetchPoetry } = useQuery<Poetry[]>({
    queryKey: ['/api/poetry'],
  });

  const categoryMap: Record<string, string> = {
    [t('literature')]: 'literature',
    [t('education')]: 'education',
    [t('culture')]: 'culture',
    [t('social')]: 'social',
  };

  const filteredEvents = selectedCategory === 'all' 
    ? events.slice(0, 3)
    : events.filter(e => e.category === (categoryMap[selectedCategory] || selectedCategory)).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />

      {/* Latest Events Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{t('latestEvents')}</h2>
              <p className="text-xl text-muted-foreground">
                {t('exploreInitiatives')}
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="text-base self-start md:self-auto"
              data-testid="button-view-all-events"
            >
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mb-8">
            <CategoryFilter
              categories={[t('literature'), t('education'), t('culture'), t('social')]}
              selected={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {eventsError ? (
            <ErrorState
              title={t('errorLoadingEvents')}
              onRetry={() => refetchEvents()}
            />
          ) : eventsLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">{t('loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  id={event.id}
                  title={event.title}
                  titleHi={event.titleHi || undefined}
                  description={event.description}
                  descriptionHi={event.descriptionHi || undefined}
                  image={event.imageUrl || ''}
                  category={t(event.category as any) || event.category}
                  date={event.date}
                  location={event.location}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Poetry Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{t('featuredPoetry')}</h2>
              <p className="text-xl text-muted-foreground">
                Voices from our community
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="text-base self-start md:self-auto"
              data-testid="button-view-all-poetry"
            >
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {poetryError ? (
            <ErrorState
              title={t('errorLoadingPoetry')}
              onRetry={() => refetchPoetry()}
            />
          ) : poetryLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">{t('loading')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {poetry.slice(0, 3).map((poem) => (
                <PoetryCard 
                  key={poem.id}
                  id={poem.id}
                  title={poem.title}
                  titleHi={poem.titleHi || undefined}
                  excerpt={poem.excerpt}
                  excerptHi={poem.excerptHi || undefined}
                  author={poem.author}
                  authorHi={poem.authorHi || undefined}
                  image={poem.imageUrl || undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent Blogs Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-2">{t('recentBlogs')}</h2>
              <p className="text-xl text-muted-foreground">
                Insights and perspectives
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="text-base self-start md:self-auto"
              data-testid="button-view-all-blogs"
            >
              {t('viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {blogsError ? (
            <ErrorState
              title={t('errorLoadingBlogs')}
              onRetry={() => refetchBlogs()}
            />
          ) : blogsLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">{t('loading')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {blogs.slice(0, 3).map((blog) => (
                <BlogCard 
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  titleHi={blog.titleHi || undefined}
                  excerpt={blog.excerpt}
                  excerptHi={blog.excerptHi || undefined}
                  image={blog.imageUrl || ''}
                  category={blog.category}
                  author={blog.author}
                  date={new Date(blog.createdAt!).toLocaleDateString()}
                  readTime="5 min read"
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
