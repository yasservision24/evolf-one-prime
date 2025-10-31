import { Menu, Brain, Database as DatabaseIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface HeaderProps {
  currentPage: 'home' | 'dataset' | 'model';
  onNavigate: (page: 'home' | 'model') => void;
}

export function Header({ currentPage, onNavigate }: HeaderProps) {
  const navigate = useNavigate();
  
  return (
    <header className="border-b border-border bg-background/100 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <h1 className="text-xl font-semibold gradient-logo">EvOlf</h1>
            </button>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => onNavigate('home')}
                className={`hover:text-foreground ${
                  currentPage === 'home'
                    ? 'text-foreground font-extrabold'
                    : 'text-muted-foreground'
                }`}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate('/dataset/dashboard')}
                className={`hover:text-foreground ${
                  currentPage === 'dataset'
                    ? 'text-foreground font-extrabold'
                    : 'text-muted-foreground'
                }`}
              >
                <DatabaseIcon className="h-4 w-4 mr-1" />
                Dataset Explorer
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('model')}
                className={`hover:text-foreground ${
                  currentPage === 'model'
                    ? 'text-foreground font-extrabold'
                    : 'text-muted-foreground'
                }`}
              >
                <Brain className="h-4 w-4 mr-1" />
                Prediction Model
              </Button>
            </nav>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="gradient-logo">EvOlf</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('home')}
                  className={`justify-start hover:text-foreground ${
                    currentPage === 'home'
                      ? 'text-foreground font-extrabold'
                      : 'text-muted-foreground'
                  }`}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dataset/dashboard')}
                  className={`justify-start hover:text-foreground ${
                    currentPage === 'dataset'
                      ? 'text-foreground font-extrabold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <DatabaseIcon className="h-4 w-4 mr-2" />
                  Dataset Explorer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('model')}
                  className={`justify-start hover:text-foreground ${
                    currentPage === 'model'
                      ? 'text-foreground font-extrabold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Prediction Model
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
