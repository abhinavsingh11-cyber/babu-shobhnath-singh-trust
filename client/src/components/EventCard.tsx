import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EventCardProps {
  id: string;
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  image: string;
  category: string;
  date: string;
  location: string;
}

export default function EventCard({
  id,
  title,
  titleHi,
  description,
  descriptionHi,
  image,
  category,
  date,
  location,
}: EventCardProps) {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();

  const displayTitle = language === 'hi' && titleHi ? titleHi : title;
  const displayDescription = language === 'hi' && descriptionHi ? descriptionHi : description;

  const handleClick = () => {
    setLocation(`/events/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 transition-all h-full flex flex-col cursor-pointer"
      data-testid={`card-event-${id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`${t('viewEvent')}: ${displayTitle}`}
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={displayTitle}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6 flex-1">
        <div className="space-y-4">
          <Badge className="text-sm" data-testid={`badge-category-${category}`}>
            {category}
          </Badge>
          <h3 className="text-xl font-semibold text-card-foreground leading-tight line-clamp-2">
            {displayTitle}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
            {displayDescription}
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>{location}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <div className="w-full flex justify-between items-center text-base text-primary">
          <span>{t('readMore')}</span>
          <ArrowRight className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
