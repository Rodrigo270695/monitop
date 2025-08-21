import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Filters {
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

interface Props {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
}

export function RoleFilters({ filters, onFiltersChange }: Props) {
    const handleSearchChange = (value: string) => {
        onFiltersChange({ ...filters, search: value });
    };

    return (
        <div className="flex items-center p-4 bg-white rounded-lg border">
            {/* Search */}
            <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--monitop-slate-400)' }} />
                <Input
                    placeholder="Buscar roles..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 h-10 cursor-text"
                    style={{
                        borderColor: 'var(--monitop-slate-300)',
                        '--tw-focus-border-color': 'var(--monitop-purple-500)',
                        '--tw-focus-ring-color': 'var(--monitop-purple-500)'
                    } as React.CSSProperties}
                />
            </div>
        </div>
    );
}
