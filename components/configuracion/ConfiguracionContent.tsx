"use client";

import { useState } from "react";

import PageTitle from "@/components/ui/PageTitle";
import Modal from "@/components/ui/Modal";

import UserTable from "@/components/configuracion/UserTable";
import UserForm from "@/components/configuracion/UserForm";

import { useUsers, SafeUser, UserFormInput } from "@/hooks/useUsers";

export default function ConfiguracionContent() {

    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<SafeUser | null>(null);

    const {

        users,

        loading,

        createUser,

        updateUser,

        deleteUser

    } = useUsers();

    function handleNew() {
        setEditing(null);
        setOpen(true);
    }

    function handleEdit(user: SafeUser) {
        setEditing(user);
        setOpen(true);
    }

    async function handleDelete(user: SafeUser) {

        if (!user._id) return;

        if (!confirm(`¿Eliminar al usuario "${user.usuario}"?`)) return;

        await deleteUser(user._id);

    }

    async function handleSave(data: UserFormInput) {

        const ok = editing?._id
            ? await updateUser(editing._id, data)
            : await createUser(data);

        if (!ok) return false;

        setOpen(false);
        setEditing(null);

        return true;

    }

    return (

        <>

            <PageTitle
                title="Configuración"
                subtitle="Usuarios y roles de acceso al sistema"
            />

            <div className="mb-6 flex justify-end">

                <button
                    onClick={handleNew}
                    className="rounded-lg bg-green-700 px-5 py-2 font-medium text-white transition hover:bg-green-800"
                >
                    + Nuevo usuario
                </button>

            </div>

            <UserTable
                users={users}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Modal
                open={open}
                title={editing ? "Editar usuario" : "Nuevo usuario"}
                onClose={() => {
                    setOpen(false);
                    setEditing(null);
                }}
            >

                <UserForm
                    initialValue={editing ?? undefined}
                    onSave={handleSave}
                    onCancel={() => {
                        setOpen(false);
                        setEditing(null);
                    }}
                />

            </Modal>

        </>

    );

}
