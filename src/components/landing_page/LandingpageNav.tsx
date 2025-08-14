import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export const LandingPageNav: React.FC = () => {

    const [mobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    // Add scroll detection for enhanced header
    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-3" : "bg-white/90 backdrop-blur-md py-4"
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />
          </div>
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#features" className="text-slate-600 hover:text-blue-700 transition-colors">Features</a>
            <a href="#benefits" className="text-slate-600 hover:text-blue-700 transition-colors">Benefits</a>
            <a href="#testimonials" className="text-slate-600 hover:text-blue-700 transition-colors">Testimonials</a>
            <a href="#faq" className="text-slate-600 hover:text-blue-700 transition-colors">FAQ</a>
            <Link to="/contact" className="text-slate-600 hover:text-blue-700 transition-colors">Contact us</Link>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow"
            >
              Get Started
            </Link>
          </nav>
          <button
            className="md:hidden text-slate-700 p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden px-6 pb-6 pt-4 space-y-4 bg-white border-t border-slate-200">
            <a href="#features" className="block py-2 text-slate-600 hover:text-blue-700">Features</a>
            <a href="#benefits" className="block py-2 text-slate-600 hover:text-blue-700">Benefits</a>
            <a href="#testimonials" className="block py-2 text-slate-600 hover:text-blue-700">Testimonials</a>
            <a href="#faq" className="block py-2 text-slate-600 hover:text-blue-700">FAQ</a>
            <Link to="/contact" className="block py-2 text-slate-600 hover:text-blue-700">Contact us</Link>
            <div className="pt-2 space-y-3">
              <Link to="/login" className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700">Login</Link>
              <Link to="/signup" className="block w-full text-center bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700">Get Started</Link>
            </div>
          </div>
        )}
      </header>
    )
}