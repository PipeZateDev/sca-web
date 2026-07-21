"use client";

import { ReactNode } from "react";

interface Props {

    open: boolean;

    title: string;

    children: ReactNode;

    onClose: () => void;

}

export default function EmployeeModal({

    open,

    title,

    children,

    onClose

}: Props) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl">

                <div className="flex justify-between items-center border-b p-5">

                    <h2 className="text-xl font-bold">

                        {title}

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600"
                    >

                        ✕

                    </button>

                </div>

                <div className="p-6">

                    {children}

                </div>

            </div>

        </div>

    );

}