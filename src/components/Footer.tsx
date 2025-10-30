import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About EvOlf */}
          <div>
            <h3 className="text-white font-semibold mb-4 transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]">
              About EvOlf
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A curated database of GPCR receptor-ligand interactions and deep learning platform for predicting binding affinity in drug discovery.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4 transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]">
              Resources
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/documentation", label: "Documentation" },
                { to: "/model-info", label: "Model Info" },
                { to: "/api", label: "API" },
                { to: "/download-dataset", label: "Download Dataset" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white text-sm transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-white font-semibold mb-4 transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]">
              Help
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/faq", label: "FAQ" },
                { to: "/contact", label: "Contact" },
                { to: "/cite-us", label: "Cite Us" },
                { to: "/submit-data", label: "Submit Data" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white text-sm transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4 transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]">
              Legal
            </h3>
            <ul className="space-y-2">
              {[
                { to: "/terms-of-use", label: "Terms of Use" },
                { to: "/privacy-policy", label: "Privacy Policy" },
                { to: "/license", label: "License" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white text-sm transition-colors duration-300 hover:text-[hsl(var(--brand-purple))]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2025{" "}
            <span className="text-white font-medium hover:text-[hsl(var(--brand-purple))] transition-colors duration-300 cursor-pointer">
              EvOlf
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
 