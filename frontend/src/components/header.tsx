import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsStaggered, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const links = [
        { href: "/about", text: "About Us" },
        { href: "/prediction", text: "Stock Prediction" },
        { href: "/news", text: "News" },
    ];

    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const closeNavbar = () => {
        setIsOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-20 py-6 bg-white shadow-md">
            <div className="flex items-center">
                <Link className="text-2xl font-bold text-blue-600" href="/">BursaLens.</Link>
            </div>
            <nav className="items-center space-x-8 hidden md:block">
                {links.map(({ href, text }) => (
                    <Link className="text-gray-600 hover:text-gray-900 font-semibold" key={href} href={href}>
                        {text}
                    </Link>
                ))}
            </nav>
            <button className="text-gray-600 hover:text-gray-900 block md:hidden" onClick={toggleNavbar}>
                <FontAwesomeIcon icon={isOpen ? faTimes : faBarsStaggered} size="2x" />
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeNavbar}></div>
            )}
            <div className={`fixed top-0 right-0 w-3/5 md:w-1/2 h-full bg-white transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden z-50`}>
                <div className="flex items-center justify-between px-4 md:px-12 py-6 bg-white">
                    <Link className="text-2xl font-bold text-blue-600" href="/">BursaLens.</Link>
                    <button className="text-gray-600 hover:text-gray-900" onClick={toggleNavbar}>
                        <FontAwesomeIcon icon={faTimes} size="2x" />
                    </button>
                </div>
                <nav className="flex flex-col space-y-8 mt-8 px-4 md:px-12">
                    {links.map(({ href, text }) => (
                        <Link className="text-gray-600 hover:text-gray-900 font-semibold text-xl" key={href} href={href} onClick={toggleNavbar}>
                            {text}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}