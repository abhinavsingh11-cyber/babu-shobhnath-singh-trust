import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import ErrorState from '@/components/ErrorState';
import { Calendar, User, Tag } from 'lucide-react';
import type { Blog } from '@shared/schema';

export default function BlogDetail() {
  const { language, t } = useLanguage();
  const [, params] = useRoute('/blogs/:id');
  const blogId = params?.id;

  const { data: blog, isLoading, isError, refetch } = useQuery<Blog>({
    queryKey: ['/api/blogs', blogId],
    enabled: !!blogId,
  });

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title={t('errorLoadingBlogs')}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">{t('loading')}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">{t('noBlogsFound')}</p>
      </div>
    );
  }

  const title = language === 'hi' && blog.titleHi ? blog.titleHi : blog.title;
  const content = language === 'hi' && blog.contentHi ? blog.contentHi : blog.content;

  return (
    <div className="min-h-screen bg-background">
      {blog.imageUrl && (
        <div className="w-full h-96 overflow-hidden">
          <img
            src={blog.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h1 className="text-5xl font-bold mb-6" data-testid="text-blog-title">
              {title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-8 text-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-5 w-5" />
                <span data-testid="text-blog-author">{blog.author}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span data-testid="text-blog-date">
                  {new Date(blog.createdAt!).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-5 w-5" />
                <span data-testid="text-blog-category">{t(blog.category as any)}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none" data-testid="text-blog-content">
              <p className="text-xl leading-relaxed whitespace-pre-wrap">{content}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
