"use client"
import React, { useState } from 'react';
import Analytics from '@/app/prediction/components/analytics';
import SearchBar from '@/app/prediction/components/stock/search';

export default function Prediction() {
    const [searchInput, setSearchInput] = useState('');
    const [symbol, setSymbol] = useState('BBCA');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSymbol(searchInput.toUpperCase());
    };

    return (
        <div className='px-6 py-14 max-w-7xl mx-auto'>
            <SearchBar
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                handleSearch={handleSearch}
            />
            <Analytics symbol={symbol} />
            <div className="my-8 text-center text-gray-500">
                <p>Note: The predictions are not 100% accurate and please don&apos;t take the data as investment advice.</p>
            </div>
        </div>
    );
}