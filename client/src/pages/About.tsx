import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Heart, BookOpen, GraduationCap, Users } from 'lucide-react';

export default function About() {
  const { language } = useLanguage();

  const title = language === 'hi' 
    ? 'बाबू शोभनाथ सिंह स्मारक ट्रस्ट के बारे में' 
    : 'About Babu Shobhnath Singh Memorial Trust';

  const subtitle = language === 'hi'
    ? 'साहित्य, शिक्षा और संस्कृति के माध्यम से समुदायों को सशक्त बनाना'
    : 'Empowering communities through Literature, Education, and Culture';

  const mission = {
    title: language === 'hi' ? 'हमारा मिशन' : 'Our Mission',
    content: language === 'hi'
      ? 'बाबू शोभनाथ सिंह स्मारक ट्रस्ट भारत भर में साहित्य, शिक्षा और सांस्कृतिक पहल को बढ़ावा देने के लिए समर्पित है। हम क्षेत्रीय भाषाओं को संरक्षित करने, शिक्षा तक पहुंच प्रदान करने और सांस्कृतिक विरासत का जश्न मनाने में विश्वास करते हैं।'
      : 'Babu Shobhnath Singh Memorial Trust is dedicated to promoting literature, education, and cultural initiatives across India. We believe in preserving regional languages, providing access to education, and celebrating cultural heritage.',
  };

  const initiatives = [
    {
      icon: BookOpen,
      title: language === 'hi' ? 'साहित्य' : 'Literature',
      description: language === 'hi'
        ? 'कविता सत्रों, लेखक बैठकों और साहित्यिक कार्यक्रमों के माध्यम से क्षेत्रीय भाषाओं और साहित्य को बढ़ावा देना।'
        : 'Promoting regional languages and literature through poetry sessions, author meets, and literary events.',
    },
    {
      icon: GraduationCap,
      title: language === 'hi' ? 'शिक्षा' : 'Education',
      description: language === 'hi'
        ? 'ग्रामीण क्षेत्रों में छात्रों को पुस्तकें, छात्रवृत्ति और शैक्षिक संसाधन प्रदान करना।'
        : 'Providing books, scholarships, and educational resources to students in rural areas.',
    },
    {
      icon: Heart,
      title: language === 'hi' ? 'संस्कृति' : 'Culture',
      description: language === 'hi'
        ? 'सांस्कृतिक कार्यक्रमों, परंपराओं और सामुदायिक समारोहों के माध्यम से विरासत का संरक्षण।'
        : 'Preserving heritage through cultural events, traditions, and community celebrations.',
    },
    {
      icon: Users,
      title: language === 'hi' ? 'सामुदायिक पहुंच' : 'Community Outreach',
      description: language === 'hi'
        ? 'समुदायों को सशक्त बनाने और सामाजिक कारणों का समर्थन करने के लिए स्थानीय संगठनों के साथ काम करना।'
        : 'Working with local organizations to empower communities and support social causes.',
    },
  ];

  const contact = {
    title: language === 'hi' ? 'संपर्क करें' : 'Get in Touch',
    facebook: language === 'hi' ? 'फेसबुक पर हमसे जुड़ें' : 'Connect with us on Facebook',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-primary-foreground mb-4" data-testid="text-about-title">
            {title}
          </h1>
          <p className="text-xl text-primary-foreground/90">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <Card className="p-8">
            <h2 className="text-3xl font-bold mb-4">{mission.title}</h2>
            <p className="text-xl leading-relaxed" data-testid="text-mission">
              {mission.content}
            </p>
          </Card>

          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">
              {language === 'hi' ? 'हमारी पहल' : 'Our Initiatives'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {initiatives.map((initiative, index) => (
                <Card key={index} className="p-6">
                  <initiative.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-2xl font-bold mb-3">{initiative.title}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {initiative.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>

          <Card className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">{contact.title}</h2>
            <p className="text-xl mb-6">{contact.facebook}</p>
            <a
              href="https://www.facebook.com/share/17gwKTpcyH/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg text-lg font-medium hover-elevate"
              data-testid="link-facebook"
            >
              {language === 'hi' ? 'फेसबुक पर देखें' : 'Visit Facebook Page'}
            </a>
          </Card>
        </div>
      </div>
    </div>
  );
}
