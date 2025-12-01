import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const License = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: 'home' | 'model') => {
    if (page === 'home') navigate('/');
    else if (page === 'model') navigate('/prediction');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="other" onNavigate={handleNavigate} />
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">License</h1>
          <p className="text-muted-foreground text-lg mb-8">
            EvOlf software licensing information
          </p>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Software License</h2>
              <h3 className="text-lg font-semibold mb-2">MIT License</h3>
              <p className="text-muted-foreground mb-4">
                The EvOlf software, including all source code, is licensed under the MIT License.
              </p>
              <div className="bg-secondary p-4 rounded-lg text-sm font-mono">
                <p className="text-muted-foreground mb-4">
                  MIT License<br /><br />
                  Copyright (c) 2025 EvOlf Team<br /><br />
                  Permission is hereby granted, free of charge, to any person obtaining a copy<br />
                  of this software and associated documentation files (the "Software"), to deal<br />
                  in the Software without restriction, including without limitation the rights<br />
                  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell<br />
                  copies of the Software, and to permit persons to whom the Software is<br />
                  furnished to do so, subject to the following conditions:<br /><br />
                  The above copyright notice and this permission notice shall be included in all<br />
                  copies or substantial portions of the Software.<br /><br />
                  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR<br />
                  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,<br />
                  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE<br />
                  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER<br />
                  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,<br />
                  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE<br />
                  SOFTWARE.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">What You Can Do</h2>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong>Use commercially</strong> - Use in proprietary software and commercial products
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong>Modify</strong> - Change the source code to fit your needs
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong>Distribute</strong> - Share original or modified versions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong>Sublicense</strong> - Include in larger projects with different licenses
                  </span>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Your Responsibilities</h2>
              <p className="text-muted-foreground mb-4">
                The MIT License only requires that you include the copyright notice and license text 
                in all copies or substantial portions of the software.
              </p>
              <p className="text-muted-foreground">
                For more questions, please contact:{" "}
                <a 
                  href="mailto:gaurav.ahuja@iiitd.ac.in"
                  className="text-accent hover:underline"
                >
                  gaurav.ahuja@iiitd.ac.in
                </a>
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