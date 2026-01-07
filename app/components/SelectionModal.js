"use client";
import React from 'react';

export default function SelectionModal({ onCancel, onSelect, optionA = { label: 'Opción A', value: 'A', loading: false }, optionB = { label: 'Opción B', value: 'B', loading: false }, message = 'Selecciona una opción' }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg p-6 w-full max-w-md shadow-md text-center">
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Cerrar"
                    className="absolute right-3 top-3 rounded-md p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>

                <h2 className="text-lg font-semibold text-gray-900 my-6">{message}</h2>

                <div className="flex justify-center gap-4 ">
                    <button
                        onClick={() => onSelect(optionA.value)}
                        className="px-4 py-2 rounded-md bg-brand hover:opacity-90 text-white flex items-center justify-center min-w-[100px]"
                        disabled={optionA.loading || optionB.loading}
                    >
                        {optionA.loading ? (
                            <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-white" role="status">
                                <span className="sr-only">Procesando...</span>
                            </div>
                        ) : optionA.label}
                    </button>

                    <button
                        onClick={() => onSelect(optionB.value)}
                        className="px-4 py-2 rounded-md bg-brand hover:opacity-90 text-white flex items-center justify-center min-w-[100px]"
                        disabled={optionA.loading || optionB.loading}
                    >
                        {optionB.loading ? (
                            <div className="inline-block h-5 w-5 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-gray-700" role="status">
                                <span className="sr-only">Procesando...</span>
                            </div>
                        ) : optionB.label}
                    </button>
                </div>
            </div>
        </div>
    );
}
