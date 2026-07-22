"use client";

import { ReactNode } from "react";

interface Props {

    open: boolean;

    title: string;

    children: ReactNode;

    onClose: () => void;

}

export default function Modal({

    open,

    title,

    children,

    onClose

}: Props) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl">

                <div className="flex items-center justify-between border-b p-4 sm:p-5">

                    <h2 className="text-lg font-bold sm:text-xl">

                        {title}

                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-red-600"
                    >

                        ✕

                    </button>

                </div>

                <div className="overflow-y-auto p-4 sm:p-6">

                    {children}

                </div>

            </div>

        </div>

    );

}
