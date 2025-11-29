import { useLocation } from 'wouter';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BlogCardProps {
  id: string;
  title: string;
  titleHi?: string;
  excerpt: string;
  excerptHi?: string;
  image: string;
  category: string;
  author: string;
  date: string;
  readTime?: string;
}

export default function BlogCard({
  id,
  title,
  titleHi,
  excerpt,
  excerptHi,
  image,
  category,
  author,
  date,
  readTime,
}: BlogCardProps) {
  const { language, t } = useLanguage();
  const [, setLocation] = useLocation();

  const displayTitle = language === 'hi' && titleHi ? titleHi : title;
  const displayExcerpt = language === 'hi' && excerptHi ? excerptHi : excerpt;

  const handleClick = () => {
    setLocation(`/blogs/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className="overflow-hidden hover-elevate active-elevate-2 transition-all cursor-pointer"
      data-testid={`card-blog-${id}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="link"
      tabIndex={0}
      aria-label={`${t('readArticle')}: ${displayTitle}`}
    >
      <div className="md:flex">
        <div className="md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden">
          <img
            src={image}
            alt={displayTitle}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 flex flex-col">
          <CardContent className="p-6 flex-1">
            <div className="space-y-4">
              <Badge className="text-sm" data-testid={`badge-category-${category}`}>
                {category}
              </Badge>
              <h3 className="text-xl font-semibold text-card-foreground leading-tight line-clamp-2">
                {displayTitle}
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-3">
                {displayExcerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 shrink-0" />
                  <span>{author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0" />
                  <span>{date}</span>
                </div>
                {readTime && (
                  <span>{readTime}</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <div className="w-full flex justify-between items-center text-base text-primary">
              <span>{t('readMore')}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
