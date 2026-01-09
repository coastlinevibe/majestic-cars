import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Cars', path: '/inventory' },
    { name: 'Services', path: '/about' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' },
  ];

  const services = [
    'Trade-In',
    'Warranty',
    'Maintenance',
  ];

  const support = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Admin', path: '/admin' },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="sterling-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">M</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">
                Majesticars
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Best selection of quality second-hand cars. Carefully inspected vehicles that look great and drive even better.
            </p>
            <p className="text-primary text-sm font-medium mb-6">
              www.majesticars.com
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook size={20} className="text-white" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Visit our Twitter page"
              >
                <Twitter size={20} className="text-white" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Visit our Instagram page"
              >
                <Instagram size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="text-primary">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div id="services">
            <h3 className="text-white font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-muted-foreground text-sm flex items-center gap-2">
                    <span className="text-primary">→</span>
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Contact */}
          <div>
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-3 mb-8">
              {support.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-muted-foreground text-sm hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="text-primary">→</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-white font-bold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone size={16} className="text-primary" />
                <span>060 857 9146</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail size={16} className="text-primary" />
                <span>majesticcarssinoville@gmail.com</span>
              </div>
              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin size={16} className="text-primary mt-0.5" />
                <span>154 Sefako Makgatho Service Ln,<br />Sinoville, Pretoria, 0129</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © 2026 Majesticars. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm">
              Powered by <a href="https://wabi-sabi.click" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Wabi-Sabi Systems</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
