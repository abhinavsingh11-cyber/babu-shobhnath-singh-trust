import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface CategoryFilterProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selected === 'all' ? 'default' : 'outline'}
        onClick={() => onSelect('all')}
        className="text-base px-6 py-2"
        data-testid="button-filter-all"
      >
        {t('viewAll')}
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selected === category ? 'default' : 'outline'}
          onClick={() => onSelect(category)}
          className="text-base px-6 py-2"
          data-testid={`button-filter-${category.toLowerCase()}`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
