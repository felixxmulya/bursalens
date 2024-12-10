import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faChartLine, faStar, faTag, faCode,
    faBuilding, faNewspaper, faBriefcase, faEnvelope,
    faPen, faBook, faCircleQuestion, faSignal,
    faChartPie, faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import {
    faTwitter,
    faFacebook,
    faInstagram,
    faLinkedin
} from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
    const mainLinks = [
        {
            title: "Product",
            links: [
                { href: "/prediction", text: "Stock Prediction", icon: faChartLine },
                { href: "/features", text: "Features", icon: faStar },
                { href: "/pricing", text: "Pricing", icon: faTag },
                { href: "/api", text: "API", icon: faCode },
            ]
        },
        {
            title: "Company",
            links: [
                { href: "/about", text: "About Us", icon: faBuilding },
                { href: "/news", text: "News", icon: faNewspaper },
                { href: "/careers", text: "Careers", icon: faBriefcase },
                { href: "/contact", text: "Contact", icon: faEnvelope },
            ]
        },
        {
            title: "Resources",
            links: [
                { href: "/blog", text: "Blog", icon: faPen },
                { href: "/documentation", text: "Documentation", icon: faBook },
                { href: "/help", text: "Help Center", icon: faCircleQuestion },
                { href: "/status", text: "System Status", icon: faSignal },
            ]
        }
    ];

    const socialLinks = [
        { href: "https://twitter.com", icon: faTwitter, label: "Twitter" },
        { href: "https://facebook.com", icon: faFacebook, label: "Facebook" },
        { href: "https://instagram.com", icon: faInstagram, label: "Instagram" },
        { href: "https://linkedin.com", icon: faLinkedin, label: "LinkedIn" },
    ];

    return (
        <footer className="bg-gray-900 min-h-[600px] flex flex-col justify-between">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 lg:px-8 py-20">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-x-12 gap-y-16 mb-16">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <Link href="/" className="inline-block">
                            <h2 className="text-3xl font-bold text-white mb-6">
                                <FontAwesomeIcon icon={faChartPie} className="mr-3" />
                                Stock Prediction
                            </h2>
                        </Link>
                        <p className="text-gray-400 text-base leading-relaxed mb-8">
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
                                            <FontAwesomeIcon 
                                                icon={faArrowRight} 
                                                className="w-4 h-4 ml-2 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" 
                                            />
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
                            &copy; {new Date().getFullYear()} Stock Prediction. All rights reserved.
                        </p>
                        <div className="flex space-x-8">
                            <Link href="/privacy" className="text-gray-400 hover:text-white text-base">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-gray-400 hover:text-white text-base">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="text-gray-400 hover:text-white text-base">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}