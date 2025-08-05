import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiChevronDown, FiHome, FiUser, FiBook, FiCalendar, FiLogOut } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo1.png";
import { GiMedicines, GiMicroscope } from 'react-icons/gi';
import { RiScan2Fill } from 'react-icons/ri';

type NavItem = {
  name: string;
  icon: React.ReactElement;
  path: string;
  action?: () => void;
};

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  // Organize nav items by category
  const getNavItems = () => {
    const items: Record<string, NavItem[]> = {
      main: [
        { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
      ],
      patient: [
        { name: 'Patients', icon: <FiUser />, path: '/patients' },
        { name: 'Reports', icon: <FiBook />, path: '/reports' },
        ...(user?.role === 'doctor' || user?.role === 'super admin' 
          ? [{ name: 'Appointments', icon: <FiCalendar />, path: '/appointments' }] 
          : []
        ),
      ],
      medical: [
        { name: 'Pharmacy', icon: <GiMedicines />, path: '/pharmacy' },
        { name: 'Laboratory', icon: <GiMicroscope />, path: '/laboratory' },
        { name: 'Ultrasound', icon: <RiScan2Fill />, path: '/ultrasound' },
        ...(user?.role === 'xray' || user?.role === 'super admin' 
          ? [{ name: 'X-Ray', icon: <RiScan2Fill />, path: '/xray' }] 
          : []
        ),
      ],
      admin: [
        ...(user?.role === 'cashier' || user?.role === 'super admin' 
          ? [{ name: 'Cashier', icon: <FiBook />, path: '/cashier' }] 
          : []
        ),
        { 
          name: 'Logout', 
          icon: <FiLogOut />, 
          path: '/login', 
          action: () => { 
            logout(); 
            navigate("/login", { replace: true }); 
          } 
        },
      ],
    };

    // Filter out empty categories
    return Object.fromEntries(
      Object.entries(items).filter(([_, items]) => items.length > 0)
    );
  };

  const navGroups = getNavItems();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [currentPath]);

  // Close menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 ">
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Navigation Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0 flex items-center">
              <img className="h-10 w-auto" src={logo} alt="ClinicPal" />
              
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-1">
              {Object.entries(navGroups).map(([category, items]) => (
                <div key={category} className="relative">
                  <button
                    onClick={() => setActiveDropdown(activeDropdown === category ? null : category)}
                    className={`flex items-center px-3 py-2 rounded-md text-white hover:bg-blue-600 transition-colors
                      ${activeDropdown === category ? 'bg-blue-600' : ''}`}
                  >
                    <span className="font-medium">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </span>
                    <FiChevronDown className={`ml-1 transform transition-transform duration-200 
                      ${activeDropdown === category ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Desktop Dropdown */}
                  <AnimatePresence>
                    {activeDropdown === category && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1">
                          {items.map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                if (item.action) item.action();
                                else navigate(item.path);
                                setActiveDropdown(null);
                              }}
                              className={`w-full flex items-center px-4 py-2 text-sm transition-colors
                                ${currentPath === item.path
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                              <span className="mr-3 text-lg">{item.icon}</span>
                              <span>{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md text-white hover:bg-blue-600 transition-colors"
              onClick={() => setIsOpen(true)}
              aria-label="Open menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-[280px] bg-gradient-to-br from-blue-800 to-indigo-800 shadow-2xl z-50"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-blue-700">
                <h2 className="text-xl font-bold text-white">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-blue-700 text-white transition-colors"
                  aria-label="Close menu"
                >
                  <FiX size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {Object.entries(navGroups).map(([category, items]) => (
                  <div key={category} className="px-4 mb-6">
                    <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-2 px-4">
                      {category}
                    </div>
                    {items.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          if (item.action) item.action();
                          else navigate(item.path);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 mb-1
                          ${currentPath === item.path
                            ? 'bg-white text-blue-800 shadow-md'
                            : 'text-white hover:bg-blue-700/50'
                          }`}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default NavBar;
