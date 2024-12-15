import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (query: string) => void;
}

export default function Search({ searchQuery, setSearchQuery, handleSearch }: SearchBarProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="max-w-3xl mx-auto flex space-x-4">
                <div className="flex-1 relative">
                    <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        placeholder="Search stock (e.g., BBCA, TLKM)"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                    />
                </div>
                <button
                    onClick={() => handleSearch(searchQuery)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                    Search
                </button>
            </div>
        </div>
    );
}