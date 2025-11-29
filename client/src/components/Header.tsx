import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Moon, Sun, User, Globe, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isLoading } = useAuth();

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('events'), href: '/events' },
    { name: t('blogs'), href: '/blogs' },
    { name: t('poetry'), href: '/poetry' },
    { name: t('about'), href: '/about' },
  ];

  const isActive = (href: string) => location === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-3 hover-elevate px-3 py-2 rounded-lg -ml-3 cursor-pointer">
              <img 
                src="/attached_assets/Logo_Babu Shobhnath Singh Memorial Trust_1762000641843.jpeg"
                alt="Babu Shobhnath Singh Memorial Trust"
                className="h-14 w-14 object-contain rounded-lg"
              />
              <div className="hidden lg:block">
                <div className="text-base font-bold text-foreground leading-tight">
                  {language === 'en' ? 'Babu Shobhnath Singh Memorial Trust' : 'बाबू शोभनाथ सिंह स्मारक ट्रस्ट'}
                </div>
                <div className="text-xs text-muted-foreground">{language === 'en' ? 'Literature • Education • Culture' : 'साहित्य • शिक्षा • संस्कृति'}</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  data-testid={`link-${item.name.toLowerCase()}`}
                  className={`px-6 py-2 text-lg rounded-lg transition-colors hover-elevate cursor-pointer ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  data-testid="button-language-toggle"
                  className="hover-elevate"
                >
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className={language === 'en' ? 'bg-accent' : ''}
                  data-testid="button-language-en"
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('hi')}
                  className={language === 'hi' ? 'bg-accent' : ''}
                  data-testid="button-language-hi"
                >
                  हिंदी (Hindi)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              className="hover-elevate"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    data-testid="button-user-menu"
                    className="hover-elevate"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {isLoading ? (
                    <DropdownMenuItem disabled>
                      {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
                    </DropdownMenuItem>
                  ) : isAuthenticated && user ? (
                    <>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.firstName || user.lastName
                              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                              : user.email}
                          </p>
                          {(user.firstName || user.lastName) && (
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => window.location.href = '/api/logout'}
                        data-testid="button-logout"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {t('logout')}
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => window.location.href = '/api/login'}
                      data-testid="button-login"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {t('login')}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover-elevate"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-6 space-y-2 border-t">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                <span
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.name.toLowerCase()}`}
                  className={`block px-6 py-4 text-xl rounded-lg hover-elevate cursor-pointer ${
                    isActive(item.href)
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            ))}
            <div className="pt-4 border-t">
              {isLoading ? (
                <Button
                  variant="outline"
                  className="w-full justify-start text-lg py-6"
                  disabled
                >
                  <User className="h-5 w-5 mr-2" />
                  {language === 'en' ? 'Loading...' : 'लोड हो रहा है...'}
                </Button>
              ) : isAuthenticated && user ? (
                <>
                  <div className="px-4 py-3 mb-2 rounded-lg bg-accent/50">
                    <p className="text-sm font-medium">
                      {user.firstName || user.lastName
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : user.email}
                    </p>
                    {(user.firstName || user.lastName) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.email}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-lg py-6"
                    onClick={() => window.location.href = '/api/logout'}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start text-lg py-6"
                  onClick={() => window.location.href = '/api/login'}
                  data-testid="button-mobile-login"
                >
                  <LogIn className="h-5 w-5 mr-2" />
                  {t('login')}
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
