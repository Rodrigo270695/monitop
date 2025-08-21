import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { RoleForm } from './role-form';

interface Role {
    id: number;
    name: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    role?: Role | null;
}

export function RoleFormModal({ isOpen, onClose, role }: Props) {
    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>
                        {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
                    </DialogTitle>
                    <DialogDescription>
                        {role ? 'Modifica la información del rol seleccionado.' : 'Crea un nuevo rol para el sistema.'}
                    </DialogDescription>
                </DialogHeader>
                <RoleForm role={role} onClose={handleClose} />
            </DialogContent>
        </Dialog>
    );
}
