'use client';
import React from 'react';

export default function ConfirmationModal({ onCancel, onConfirm, message, loading }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-md text-center">
                <h2 className="text-lg font-semibold text-gray-900 my-6 ">{message}</h2>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 rounded-md bg-brand hover:opacity-90 text-white flex items-center justify-center min-w-[100px]"
                        disabled={loading}
                    >
                        {loading ? (
                            <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white" role="status">
                                <span className="sr-only">Eliminando...</span>
                            </div>
                        ) : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
