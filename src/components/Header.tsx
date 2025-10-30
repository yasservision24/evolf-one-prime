import { Search, Menu, Brain, Database as DatabaseIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  currentPage: 'home' | 'dataset' | 'model';
  onNavigate: (page: 'home' | 'dataset' | 'model') => void;
  onSearch?: (query: string) => void;
  showSearch?: boolean;
}

export function Header({ currentPage, onNavigate, onSearch, showSearch = false }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-semibold">E</span>
              </div>
              <h1 className="text-xl font-semibold gradient-logo">EvOlf</h1>
            </button>
            <nav className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => onNavigate('home')}
                className={currentPage === 'home' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('dataset')}
                className={currentPage === 'dataset' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              >
                <DatabaseIcon className="h-4 w-4 mr-1" />
                Dataset Explorer
              </Button>
              <Button
                variant="ghost"
                onClick={() => onNavigate('model')}
                className={currentPage === 'model' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
              >
                <Brain className="h-4 w-4 mr-1" />
                Prediction Model
              </Button>
            </nav>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        {showSearch && (
          <div className="pb-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search receptors and ligands by name, accession, or organism..."
                className="pl-10 border-border focus:border-primary focus:ring-ring/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && onSearch) {
                    onSearch(e.currentTarget.value);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
