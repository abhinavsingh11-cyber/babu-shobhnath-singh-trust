import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import ErrorState from '@/components/ErrorState';
import { User } from 'lucide-react';
import type { Poetry } from '@shared/schema';

export default function PoetryDetail() {
  const { language, t } = useLanguage();
  const [, params] = useRoute('/poetry/:id');
  const poetryId = params?.id;

  const { data: poem, isLoading, isError, refetch } = useQuery<Poetry>({
    queryKey: ['/api/poetry', poetryId],
    enabled: !!poetryId,
  });

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title={t('errorLoadingPoetry')}
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

  if (!poem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">{t('noPoetryFound')}</p>
      </div>
    );
  }

  const title = language === 'hi' && poem.titleHi ? poem.titleHi : poem.title;
  const content = language === 'hi' && poem.contentHi ? poem.contentHi : poem.content;
  const author = language === 'hi' && poem.authorHi ? poem.authorHi : poem.author;

  return (
    <div className="min-h-screen bg-background">
      {poem.imageUrl && (
        <div className="w-full h-96 overflow-hidden">
          <img
            src={poem.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <h1 className="text-5xl font-bold mb-6 text-center" data-testid="text-poetry-title">
              {title}
            </h1>

            <div className="flex items-center justify-center gap-2 mb-8 text-lg text-muted-foreground">
              <User className="h-5 w-5" />
              <span data-testid="text-poetry-author">{author}</span>
            </div>

            <div 
              className="text-2xl leading-loose text-center whitespace-pre-wrap font-serif" 
              data-testid="text-poetry-content"
            >
              {content}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
