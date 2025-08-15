<?php

namespace App\Http\Requests\Role;

use Illuminate\Foundation\Http\FormRequest;
use Spatie\Permission\Models\Role;

class RoleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        if ($this->isMethod('POST')) {
            return $this->user()->can('create_roles');
        }
        
        return $this->user()->can('edit_roles');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
        ];

        // Add unique validation for name, excluding current role on update
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $roleId = $this->route('role')->id;
            $rules['name'][] = "unique:roles,name,{$roleId}";
        } else {
            $rules['name'][] = 'unique:roles,name';
        }

        // Solo validar permisos si se envían
        if ($this->has('permissions')) {
            $rules['permissions'] = ['array'];
            $rules['permissions.*'] = ['exists:permissions,name'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'El nombre del rol es obligatorio.',
            'name.unique' => 'Ya existe un rol con este nombre.',
            'name.max' => 'El nombre del rol no puede tener más de 255 caracteres.',
            'permissions.array' => 'Los permisos deben ser una lista.',
            'permissions.*.exists' => 'Uno o más permisos seleccionados no existen.',
        ];
    }
}
