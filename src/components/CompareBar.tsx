import { X, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Car } from '@/components/CarCard';

interface CompareBarProps {
  cars: Car[];
  onRemove: (carId: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

const CompareBar = ({ cars, onRemove, onCompare, onClear }: CompareBarProps) => {
  if (cars.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg animate-slide-up">
      <div className="sterling-container py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 text-foreground font-semibold whitespace-nowrap">
              <GitCompare size={20} className="text-primary" />
              <span>Compare ({cars.length}/4)</span>
            </div>
            
            <div className="flex gap-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="relative flex items-center gap-3 bg-secondary rounded-lg p-2 pr-8 min-w-[180px]"
                >
                  <img
                    src={car.image}
                    alt={car.name}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">{car.name}</div>
                    <div className="text-xs text-muted-foreground">R {car.price.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => onRemove(car.id)}
                    className="absolute top-1 right-1 w-5 h-5 bg-muted hover:bg-destructive hover:text-destructive-foreground rounded-full flex items-center justify-center transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClear}>
              Clear All
            </Button>
            <Button onClick={onCompare} disabled={cars.length < 2}>
              <GitCompare size={18} className="mr-2" />
              Compare Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareBar;
