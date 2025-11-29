import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import heroImage from '@assets/generated_images/Kavi_Sammelan_cultural_gathering_8efabbd5.png';

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="relative h-[70vh] min-h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Cultural gathering"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex items-center justify-center">
        <div className="max-w-3xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight tracking-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover-elevate active-elevate-2"
              data-testid="button-explore-initiatives"
            >
              <Link href="/events">
                {t('exploreInitiatives')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 backdrop-blur-md bg-white/20 text-white border-white/40 hover:bg-white/30 hover-elevate active-elevate-2"
              data-testid="button-learn-more"
            >
              <Link href="/about">
                {t('learnMore')}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
