import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

const License = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="home" onNavigate={() => {}} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">License</h1>
          <p className="text-muted-foreground text-lg mb-8">
            evolf database and software licensing information
          </p>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Database License</h2>
              <h3 className="text-lg font-semibold mb-2">Creative Commons Attribution 4.0 International (CC BY 4.0)</h3>
              <p className="text-muted-foreground mb-4">
                The evolf database is licensed under CC BY 4.0. This allows you to:
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong>Share</strong> — copy and redistribute the material in any medium or format
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    <strong>Adapt</strong> — remix, transform, and build upon the material for any purpose
                  </span>
                </li>
              </ul>
              <p className="text-muted-foreground text-sm">
                <strong>Under the following terms:</strong> You must give appropriate credit, provide a link 
                to the license, and indicate if changes were made. You may not apply legal terms or technological 
                measures that legally restrict others from doing anything the license permits.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Software License</h2>
              <h3 className="text-lg font-semibold mb-2">MIT License</h3>
              <div className="bg-secondary p-4 rounded-lg text-sm">
                <p className="text-muted-foreground mb-2">Copyright (c) 2025 evolf Team</p>
                <p className="text-muted-foreground mb-4">
                  Permission is hereby granted, free of charge, to any person obtaining a copy of this 
                  software and associated documentation files (the "Software"), to deal in the Software 
                  without restriction, including without limitation the rights to use, copy, modify, merge, 
                  publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
                  to whom the Software is furnished to do so, subject to the following conditions:
                </p>
                <p className="text-muted-foreground mb-4">
                  The above copyright notice and this permission notice shall be included in all copies or 
                  substantial portions of the Software.
                </p>
                <p className="text-muted-foreground">
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
                  INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
                  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE 
                  FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
                  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
                  DEALINGS IN THE SOFTWARE.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Model License</h2>
              <p className="text-muted-foreground mb-4">
                The evolf prediction model is available for academic and research use under CC BY-NC 4.0 
                (Attribution-NonCommercial). Commercial use requires a separate license agreement.
              </p>
              <p className="text-muted-foreground">
                For commercial licensing inquiries, please contact: licensing@evolf.com
              </p>
            </Card>

            <Card className="p-6 bg-secondary/50">
              <h3 className="text-lg font-semibold mb-2">Third-Party Licenses</h3>
              <p className="text-muted-foreground text-sm">
                evolf incorporates open-source software components. A complete list of third-party licenses 
                is available in our GitHub repository. We are grateful to the open-source community for their 
                contributions.
              </p>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default License;
