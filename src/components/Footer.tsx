import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About evolf */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">About evolf</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              A curated database of GPCR receptor-ligand interactions and deep learning platform for predicting binding affinity in drug discovery.
            </p>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/documentation" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/model-info" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Model Info
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link to="/download-dataset" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Download Dataset
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Help</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cite-us" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Cite Us
                </Link>
              </li>
              <li>
                <Link to="/submit-data" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Submit Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-use" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/license" className="text-accent hover:text-accent/80 text-sm transition-colors">
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 evolf. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
