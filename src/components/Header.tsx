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
  currentPage: 'home' | 'dataset' | 'model' | 'other';
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
              <h1 className="text-xl font-semibold gradient-evolf">EvOlf</h1>
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
                onClick={() => navigate('/prediction')}
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
              <Button variant="ghost" size="icon" className="md:hidden h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader className="border-b pb-4">
                <SheetTitle>
                  <button
                    onClick={() => onNavigate('home')}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <h1 className="text-2xl font-semibold gradient-evolf">EvOlf</h1>
                  </button>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                <Button
                  variant="ghost"
                  onClick={() => onNavigate('home')}
                  className={`justify-start h-14 text-base hover:bg-accent ${
                    currentPage === 'home'
                      ? 'bg-accent text-foreground font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dataset/dashboard')}
                  className={`justify-start h-14 text-base hover:bg-accent ${
                    currentPage === 'dataset'
                      ? 'bg-accent text-foreground font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <DatabaseIcon className="h-5 w-5 mr-3" />
                  Dataset Explorer
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/prediction')}
                  className={`justify-start h-14 text-base hover:bg-accent ${
                    currentPage === 'model'
                      ? 'bg-accent text-foreground font-semibold'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Brain className="h-5 w-5 mr-3" />
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
