"use client";
import React, { useState } from "react";

export default function SearchBar({ categories = [], onSearch }) {
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Todos");
    const [searchValue, setSearchValue] = useState("");

    const toggleDropdown = () => {
        setShowDropdown(prev => !prev);
    };

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setShowDropdown(false);
        if (onSearch) onSearch(searchValue, category);
    };

    const handleInputChange = (e) => {
        setSearchValue(e.target.value);
        if (onSearch) onSearch(e.target.value, selectedCategory);
    };

    return (
        <div className="max-w-lg mx-auto relative">
            <div className="flex">
                <label htmlFor="search-dropdown" className="mb-2 text-sm font-medium text-gray-900 sr-only">Buscar</label>

                <button
                    id="dropdown-button"
                    onClick={toggleDropdown}
                    className="shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-s-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100"
                    type="button"
                >
                    {selectedCategory}
                    <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                    </svg>
                </button>

                {showDropdown && (
                    <div
                        id="dropdown"
                        className="absolute top-full mt-2 z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
                    >
                        <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdown-button">
                            {categories.map((cat) => (
                                <li key={cat}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelectCategory(cat)}
                                        className="inline-flex w-full px-4 py-2 hover:bg-gray-100"
                                    >
                                        {cat}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="relative w-full">
                    <input
                        type="search"
                        id="search-dropdown"
                        className="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Buscar ${selectedCategory === "Todos" ? "..." : selectedCategory}`}
                        value={searchValue}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        type="button"
                        className="absolute top-0 end-0 p-2.5 text-sm font-medium h-full text-white bg-brand rounded-e-lg hover:opacity-90 focus:ring-4 focus:outline-none"
                    >
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
