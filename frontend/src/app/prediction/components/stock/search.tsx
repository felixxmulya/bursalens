import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
    searchInput: string;
    setSearchInput: (value: string) => void;
    handleSearch: (e: React.FormEvent) => void;
}

export default function SearchBar({ searchInput, setSearchInput, handleSearch }: SearchBarProps) {
    return (
        <div className="mb-6">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Enter Blue Chip stock (e.g., BBCA, TLKM)"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Search
                </button>
            </form>
        </div>
    );
}