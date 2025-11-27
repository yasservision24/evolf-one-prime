import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
          
          {/* About EvOlf */}
          <div>
            <h3 className="text-foreground font-semibold mb-3 md:mb-4 text-base md:text-base transition-colors duration-300 hover:text-brand-purple">
              About EvOlf   
            </h3>
            <p className="text-muted-foreground text-sm md:text-sm leading-relaxed">
              A curated database of GPCR receptor-ligand interactions and deep learning platform for predicting Binding Interactions.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-foreground font-semibold mb-3 md:mb-4 text-base md:text-base transition-colors duration-300 hover:text-brand-teal">
              Resources
            </h3>
            <ul className="space-y-3 md:space-y-2">
              {[
                { to: "/documentation", label: "How To Use EvOlf" },
                { to: "/model-info", label: "Model Info" },
                { to: "/api", label: "API" },
                { to: "/links", label: "Useful Links" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground text-sm md:text-sm block py-1 transition-colors duration-300 hover:text-brand-teal hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-foreground font-semibold mb-3 md:mb-4 text-base md:text-base transition-colors duration-300 hover:text-brand-gold">
              Help
            </h3>
            <ul className="space-y-3 md:space-y-2">
              {[
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
                { to: "/cite-us", label: "Cite Us" },
                
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground text-sm md:text-sm block py-1 transition-colors duration-300 hover:text-brand-gold hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-3 md:mb-4 text-base md:text-base transition-colors duration-300 hover:text-brand-purple">
              Legal
            </h3>
            <ul className="space-y-3 md:space-y-2">
              {[
                { to: "/terms-of-use", label: "Terms of Use" },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/license", label: "License" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground text-sm md:text-sm block py-1 transition-colors duration-300 hover:text-brand-purple hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-xs md:text-sm">
            © 2025{" "}
            <span className="gradient-evolf font-semibold cursor-pointer">
              EvOlf
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
 