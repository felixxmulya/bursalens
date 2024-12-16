import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface SearchBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleSearch: (query: string) => void;
    loading: boolean;
}

export default function SearchBar({ 
    searchQuery, 
    setSearchQuery, 
    handleSearch,
    loading 
}: SearchBarProps) {
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
                        onKeyPress={(e) => e.key === 'Enter' && !loading && handleSearch(searchQuery)}
                        disabled={loading}
                    />
                </div>
                <button
                    onClick={() => handleSearch(searchQuery)}
                    disabled={loading}
                    className={`px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Loading...
                        </div>
                    ) : (
                        'Search'
                    )}
                </button>
            </div>
        </div>
    );
}