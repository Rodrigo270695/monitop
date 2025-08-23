import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    onCreate: () => void;
}

export function UserActions({ onCreate }: Props) {
    return (
        <Button
            onClick={onCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
        >
            <Plus className="h-4 w-4 mr-2" />
            Crear Usuario
        </Button>
    );
}
