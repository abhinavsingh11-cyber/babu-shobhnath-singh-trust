import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import BlogCard from '@/components/BlogCard';
import ErrorState from '@/components/ErrorState';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Blog } from '@shared/schema';

export default function Blogs() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: blogs = [], isLoading, isError, refetch } = useQuery<Blog[]>({
    queryKey: ['/api/blogs'],
  });

  const filteredBlogs = blogs.filter(blog => {
    if (!searchQuery) return true;
    
    return blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.titleHi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            {t('blogs')}
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Insights and perspectives
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder={t('searchBlogs')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
              data-testid="input-search-blogs"
            />
          </div>
        </div>

        {isError ? (
          <ErrorState
            title={t('errorLoadingBlogs')}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('loading')}</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('noBlogsFound')}</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto">
            {filteredBlogs.map((blog) => (
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
    </div>
  );
}
