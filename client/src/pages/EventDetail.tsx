import { useQuery } from '@tanstack/react-query';
import { useRoute } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import ErrorState from '@/components/ErrorState';
import { Calendar, MapPin, Tag } from 'lucide-react';
import type { Event } from '@shared/schema';

export default function EventDetail() {
  const { language, t } = useLanguage();
  const [, params] = useRoute('/events/:id');
  const eventId = params?.id;

  const { data: event, isLoading, isError, refetch } = useQuery<Event>({
    queryKey: ['/api/events', eventId],
    enabled: !!eventId,
  });

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <ErrorState
          title={t('errorLoadingEvents')}
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

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-xl text-muted-foreground">{t('noEventsFound')}</p>
      </div>
    );
  }

  const title = language === 'hi' && event.titleHi ? event.titleHi : event.title;
  const description = language === 'hi' && event.descriptionHi ? event.descriptionHi : event.description;
  const location = language === 'hi' && event.locationHi ? event.locationHi : event.location;

  return (
    <div className="min-h-screen bg-background">
      {event.imageUrl && (
        <div className="w-full h-96 overflow-hidden">
          <img
            src={event.imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <h1 className="text-5xl font-bold mb-6" data-testid="text-event-title">
              {title}
            </h1>

            <div className="flex flex-wrap gap-6 mb-8 text-lg">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span data-testid="text-event-date">{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span data-testid="text-event-location">{location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="h-5 w-5" />
                <span data-testid="text-event-category">{t(event.category as any)}</span>
              </div>
            </div>

            <div className="prose prose-lg max-w-none" data-testid="text-event-description">
              <p className="text-xl leading-relaxed whitespace-pre-wrap">{description}</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
