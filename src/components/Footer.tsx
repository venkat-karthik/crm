import React from 'react';
import { KairooLogo } from './KairooLogo';
import { Linkedin, Twitter, Youtube, Github, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenPricing?: () => void;
  onOpenContact?: () => void;
  onOpenDocumentation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPricing,
  onOpenContact,
  onOpenDocumentation,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#succeed' },
    { name: 'Integrations', href: '#journey' },
    { name: 'Dashboard', href: '#succeed' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#stories' },
    { name: 'Careers', href: '#hero' },
    { name: 'Contact', href: '#cta' },
  ];

  const resourceLinks = [
    { name: 'Help Center', href: '#features' },
    { name: 'Blog', href: '#stories' },
    { name: 'Documentation', href: '#ai' },
  ];

  return (
    <footer className="bg-[#07150E] text-[#FAF6F0] border-t border-[#173829] pt-16 sm:pt-20 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#FAF6F0]/10">
          {/* Brand Left Column */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <KairooLogo variant="light" size="lg" showTagline={true} />
              <p className="mt-4 text-xs sm:text-sm text-[#FAF6F0]/70 max-w-sm leading-relaxed">
                The next-generation intelligent CRM designed to empower growing enterprises with unified customer data, predictive AI, and friction-free sales workflows.
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-6 lg:mt-8">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-[#112B1F] border border-[#204B37] flex items-center justify-center text-[#FAF6F0]/70 hover:text-[#C5A059] hover:border-[#C5A059] transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-9 h-9 rounded-full bg-[#112B1F] border border-[#204B37] flex items-center justify-center text-[#FAF6F0]/70 hover:text-[#C5A059] hover:border-[#C5A059] transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-[#112B1F] border border-[#204B37] flex items-center justify-center text-[#FAF6F0]/70 hover:text-[#C5A059] hover:border-[#C5A059] transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="w-9 h-9 rounded-full bg-[#112B1F] border border-[#204B37] flex items-center justify-center text-[#FAF6F0]/70 hover:text-[#C5A059] hover:border-[#C5A059] transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C5A059] mb-4">
              Product
            </h4>
            <ul className="space-y-2.5">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs sm:text-sm text-[#FAF6F0]/75 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C5A059] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs sm:text-sm text-[#FAF6F0]/75 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#C5A059] mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs sm:text-sm text-[#FAF6F0]/75 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF6F0]/60">
          <p>© 2026 Kairoo. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Security Standards</span>
            
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-[#C5A059] hover:text-white transition-colors ml-2 cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
