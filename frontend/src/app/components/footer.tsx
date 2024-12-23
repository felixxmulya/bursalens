"use client";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faStar, faBuilding, faNewspaper, faChartPie } from '@fortawesome/free-solid-svg-icons';
import {faXTwitter, faFacebook,faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    const mainLinks = [
        {
            title: "Product",
            links: [
                { href: "/prediction", text: "Stock Prediction", icon: faChartLine },
                { href: "/#feature", text: "Features", icon: faStar },
            ]
        },
        {
            title: "Company",
            links: [
                { href: "/#about", text: "About Us", icon: faBuilding },
                { href: "/news", text: "News", icon: faNewspaper },
            ]
        }
    ];

    const socialLinks = [
        { href: "https://twitter.com", icon: faXTwitter, label: "Twitter" },
        { href: "https://facebook.com", icon: faFacebook, label: "Facebook" },
        { href: "https://instagram.com", icon: faInstagram, label: "Instagram" },
        { href: "https://linkedin.com", icon: faLinkedin, label: "LinkedIn" },
    ];

    return (
        <footer className="bg-gray-900 min-h-[600px] flex flex-col justify-between">

            <div className="container mx-auto px-4 py-32">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-12 gap-y-16 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                <FontAwesomeIcon icon={faChartPie} className="mr-3" />
                                BursaLens.
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-base leading-relaxed">
                            Advanced AI-powered stock predictions and analysis for Indonesian markets.
                            Make smarter investment decisions with real-time insights.
                        </p>
                        <div className="flex items-center space-x-6">
                            {socialLinks.map((link, index) => (
                                <Link 
                                    key={index}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label={link.label}
                                >
                                    <FontAwesomeIcon icon={link.icon} className="w-6 h-6" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Sections */}
                    {mainLinks.map((section, index) => (
                        <div key={index} className="lg:col-span-1">
                            <h3 className="text-white text-xl font-semibold mb-6">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link 
                                            href={link.href}
                                            className="text-gray-400 hover:text-white text-base flex items-center group"
                                        >
                                            <FontAwesomeIcon icon={link.icon} className="w-5 h-5 mr-3" />
                                            {link.text}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 mt-12 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
                        <p className="text-gray-400 text-base">
                            &copy; {new Date().getFullYear()} BursaLens. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}