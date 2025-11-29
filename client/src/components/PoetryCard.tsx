import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { User, BookOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PoetryCardProps {
  id: string;
  title: string;
  titleHi?: string;
  excerpt: string;
  excerptHi?: string;
  author: string;
  authorHi?: string;
  image?: string;
}

export default function PoetryCard({
  id,
  title,
  titleHi,
  excerpt,
  excerptHi,
  author,
  authorHi,
  image,
}: PoetryCardProps) {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();

  const displayTitle = language === 'hi' && titleHi ? titleHi : title;
  const displayExcerpt = language === 'hi' && excerptHi ? excerptHi : excerpt;
  const displayAuthor = language === 'hi' && authorHi ? authorHi : author;

  const handleClick = () => {
    setLocation(`/poetry/${id}`);
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
      data-testid={`card-poetry-${id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`${t('readPoem')}: ${displayTitle} ${t('by')} ${displayAuthor}`}
    >
      {image && (
        <div className="aspect-[3/4] overflow-hidden">
          <img
            src={image}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardContent className="p-6 flex-1">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <BookOpen className="h-5 w-5" />
            <span className="text-sm font-medium">{t('poetry')}</span>
          </div>
          <h3 className="text-xl font-semibold text-card-foreground leading-tight">
            {displayTitle}
          </h3>
          <p className={`text-base text-muted-foreground leading-relaxed italic line-clamp-4 ${language === 'hi' ? 'text-lg' : ''}`}>
            {displayExcerpt}
          </p>
          <div className="flex items-center gap-2 text-base text-muted-foreground pt-2">
            <User className="h-4 w-4 shrink-0" />
            <span>{displayAuthor}</span>
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
