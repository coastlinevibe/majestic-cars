import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';

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
    'Financing',
    'Trade-In',
    'Warranty',
    'Maintenance',
    'Insurance',
  ];

  const support = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Terms of Service', path: '/terms-of-service' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Careers', path: '#' },
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
              <span className="text-card font-bold text-xl tracking-tight">
                Majesticars
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Majesticars is your premier destination for luxury and performance vehicles. With 30+ years of excellence, we deliver exceptional automotive experiences.
            </p>
            <div className="flex gap-4">
              {['facebook', 'twitter', 'instagram'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 rounded-full bg-card/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-card rounded-full" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-card font-bold mb-6">Quick Links</h4>
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
          <div>
            <h4 className="text-card font-bold mb-6">Services</h4>
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
            <h4 className="text-card font-bold mb-6">Support</h4>
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

            <h4 className="text-card font-bold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Phone size={16} className="text-primary" />
                <span>060 857 9146</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail size={16} className="text-primary" />
                <span>info@majesticcars.co.za</span>
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
          <p className="text-muted-foreground text-sm">
            © 2026 Majesticars. All rights reserved.
          </p>
          <div className="flex gap-6 text-muted-foreground text-sm">
            <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
