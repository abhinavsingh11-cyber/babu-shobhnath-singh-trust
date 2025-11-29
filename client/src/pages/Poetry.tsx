import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import PoetryCard from '@/components/PoetryCard';
import ErrorState from '@/components/ErrorState';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Poetry } from '@shared/schema';

export default function PoetryPage() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: poetry = [], isLoading, isError, refetch } = useQuery<Poetry[]>({
    queryKey: ['/api/poetry'],
  });

  const filteredPoetry = poetry.filter(poem => {
    if (!searchQuery) return true;
    
    return poem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.titleHi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poem.author.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            {t('poetry')}
          </h1>
          <p className="text-xl text-primary-foreground/90">
            Voices from our community
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder={t('searchPoetry')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg"
              data-testid="input-search-poetry"
            />
          </div>
        </div>

        {isError ? (
          <ErrorState
            title={t('errorLoadingPoetry')}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('loading')}</p>
          </div>
        ) : filteredPoetry.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('noPoetryFound')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPoetry.map((poem) => (
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
    </div>
  );
}
