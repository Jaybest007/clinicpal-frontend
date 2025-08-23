import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import { motion, AnimatePresence } from "framer-motion";
import { FiExternalLink, FiChevronDown } from "react-icons/fi";

export const LandingPageNav: React.FC = () => {
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Add scroll detection for enhanced header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (mobileOpen && !target.closest('nav') && !target.closest('button')) {
                setMobileOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [mobileOpen]);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMobileOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    // Close mobile menu when window is resized to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Navigation items for better maintainability
    const navItems = [
        { name: "Features", href: "#features" },
        { name: "Benefits", href: "#benefits" },
        { name: "Pricing", href: "#pricing" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "FAQ", href: "#faq" },
        { name: "Contact", href: "/contact", isLink: true }
    ];
    
    const solutions = [
        { name: "For Clinics", description: "Perfect for small to medium clinics", href: "#pricing" },
        { name: "For Hospitals", description: "Enterprise solutions for larger facilities", href: "#pricing" },
        { name: "For Pharmacies", description: "Standalone pharmacy management", href: "#pricing" },
        { name: "For Laboratories", description: "Lab test management and reporting", href: "#pricing" },
    ];

    const toggleDropdown = (name: string) => {
        setActiveDropdown(activeDropdown === name ? null : name);
    };

    return (
        <header 
            className={`sticky top-0 z-50 transition-all duration-300 ${
                isScrolled ? "bg-white shadow-md py-2" : "bg-white/90 backdrop-blur-md py-3"
            }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-3"
                >
                    <Link to="/" className="flex items-center space-x-2">
                        <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />
                    </Link>
                </motion.div>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    {/* Solutions Dropdown */}
                    <div className="relative">
                        <button 
                            className={`flex items-center space-x-1 text-slate-600 hover:text-blue-700 transition-colors ${activeDropdown === 'solutions' ? 'text-blue-700' : ''}`}
                            onClick={() => toggleDropdown('solutions')}
                            onMouseEnter={() => setActiveDropdown('solutions')}
                            aria-expanded={activeDropdown === 'solutions'}
                        >
                            <span>Solutions</span>
                            <FiChevronDown className={`transition-transform duration-200 ${activeDropdown === 'solutions' ? 'transform rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {activeDropdown === 'solutions' && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute left-0 mt-2 w-64 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden z-50"
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div className="p-1">
                                        {solutions.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-start px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                                                onClick={() => setActiveDropdown(null)}
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-900">{item.name}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Regular Nav Items */}
                    {navItems.map((item) => (
                        item.isLink ? (
                            <Link 
                                key={item.name}
                                to={item.href}
                                className="text-slate-600 hover:text-blue-700 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <a 
                                key={item.name}
                                href={item.href}
                                className="text-slate-600 hover:text-blue-700 transition-colors"
                            >
                                {item.name}
                            </a>
                        )
                    ))}
                    
                    {/* Auth Buttons */}
                    <div className="flex items-center space-x-3">
                        <Link
                            to="/login"
                            className="bg-white border border-blue-200 text-blue-700 px-5 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow flex items-center"
                        >
                            <span>Get Started</span>
                            <motion.span
                                initial={{ x: 0 }}
                                animate={{ x: [0, 3, 0] }}
                                transition={{ 
                                    repeat: Infinity, 
                                    repeatType: "reverse", 
                                    duration: 1.5 
                                }}
                                className="ml-1"
                            >
                                →
                            </motion.span>
                        </Link>
                    </div>
                </nav>
                
                {/* Mobile Menu Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-gray-100"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle Menu"
                    aria-expanded={mobileOpen}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
                        />
                    </svg>
                </motion.button>
            </div>
            
            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden px-6 pb-6 pt-4 space-y-2 bg-white border-t border-slate-200 overflow-hidden"
                    >
                        {/* Solutions Dropdown Mobile */}
                        <div className="py-1">
                            <button
                                onClick={() => toggleDropdown('mobile-solutions')}
                                className="flex items-center justify-between w-full py-2 text-slate-600 hover:text-blue-700"
                            >
                                <span>Solutions</span>
                                <FiChevronDown className={`transition-transform duration-200 ${activeDropdown === 'mobile-solutions' ? 'transform rotate-180' : ''}`} />
                            </button>
                            
                            <AnimatePresence>
                                {activeDropdown === 'mobile-solutions' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-1 pl-4 border-l-2 border-blue-100 space-y-2"
                                    >
                                        {solutions.map((item) => (
                                            <a
                                                key={item.name}
                                                href={item.href}
                                                className="block py-2 text-slate-600 hover:text-blue-700"
                                                onClick={() => setMobileOpen(false)}
                                            >
                                                {item.name}
                                            </a>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        
                        {/* Regular Nav Items Mobile */}
                        {navItems.map((item) => (
                            item.isLink ? (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="block py-2 text-slate-600 hover:text-blue-700"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="block py-2 text-slate-600 hover:text-blue-700"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item.name}
                                </a>
                            )
                        ))}
                        
                        {/* Auth Buttons Mobile */}
                        <div className="pt-2 space-y-3">
                            <Link 
                                to="/login" 
                                className="block w-full text-center bg-white border border-blue-200 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-50"
                                onClick={() => setMobileOpen(false)}
                            >
                                Login
                            </Link>
                            <Link 
                                to="/signup" 
                                className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700"
                                onClick={() => setMobileOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                        
                        {/* Quick Contact */}
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">Have questions? Get in touch</p>
                            <a 
                                href="mailto:care@clinicpal.org" 
                                className="text-sm text-blue-600 flex items-center hover:underline"
                            >
                                care@clinicpal.org
                                <FiExternalLink className="ml-1 h-3 w-3" />
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};