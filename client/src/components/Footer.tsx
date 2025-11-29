import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const quickLinks = [
    { name: t('home'), href: '/' },
    { name: t('events'), href: '/events' },
    { name: t('blogs'), href: '/blogs' },
    { name: t('poetry'), href: '/poetry' },
    { name: t('about'), href: '/about' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/attached_assets/Logo_Babu Shobhnath Singh Memorial Trust_1762000641843.jpeg"
                alt="Babu Shobhnath Singh Memorial Trust"
                className="h-12 w-12 object-contain rounded-lg"
              />
              <div className="text-base font-bold leading-tight">Babu Shobhnath Singh<br/>Memorial Trust</div>
            </div>
            <p className="text-base text-muted-foreground leading-relaxed">
              Preserving culture and empowering communities through literature, education, and cultural initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base text-muted-foreground hover:text-foreground transition-colors hover-elevate inline-block px-2 py-1 rounded -ml-2"
                    data-testid={`link-footer-${link.name.toLowerCase()}`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-base text-muted-foreground">
                <MapPin className="h-5 w-5 mt-0.5 shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
              <li className="flex items-center gap-3 text-base text-muted-foreground">
                <Phone className="h-5 w-5 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-base text-muted-foreground">
                <Mail className="h-5 w-5 shrink-0" />
                <span>info@culturaltrust.org</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('followUs')}</h3>
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/share/17gwKTpcyH/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                data-testid="link-social-facebook"
                className="h-12 w-12 rounded-lg bg-accent hover-elevate active-elevate-2 flex items-center justify-center text-accent-foreground transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              {socialLinks.slice(1).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                  className="h-12 w-12 rounded-lg bg-accent hover-elevate active-elevate-2 flex items-center justify-center text-accent-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-base text-muted-foreground">
            © {new Date().getFullYear()} Babu Shobhnath Singh Memorial Trust. {t('allRightsReserved')}
          </p>
        </div>
      </div>
    </footer>
  );
}
