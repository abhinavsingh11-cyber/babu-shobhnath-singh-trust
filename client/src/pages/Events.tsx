import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import EventCard from '@/components/EventCard';
import CategoryFilter from '@/components/CategoryFilter';
import ErrorState from '@/components/ErrorState';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { Event } from '@shared/schema';

export default function Events() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: events = [], isLoading, isError, refetch } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  const categoryMap: Record<string, string> = {
    [t('literature')]: 'literature',
    [t('education')]: 'education',
    [t('culture')]: 'culture',
    [t('social')]: 'social',
  };

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || 
      event.category === (categoryMap[selectedCategory] || selectedCategory);
    
    const matchesSearch = !searchQuery || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.titleHi?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4">
            {t('events')}
          </h1>
          <p className="text-xl text-primary-foreground/90">
            {t('exploreInitiatives')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder={t('searchEvents')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
                data-testid="input-search-events"
              />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <CategoryFilter
            categories={[t('literature'), t('education'), t('culture'), t('social')]}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {isError ? (
          <ErrorState
            title={t('errorLoadingEvents')}
            onRetry={() => refetch()}
          />
        ) : isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('loading')}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">{t('noEventsFound')}</p>
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
    </div>
  );
}
