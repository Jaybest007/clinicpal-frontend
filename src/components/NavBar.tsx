import { useState, useEffect } from 'react';
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUser,
  FiLogOut,
  FiBook,
  FiX,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo1.png";
import { GiMedicines, GiMicroscope } from 'react-icons/gi';
import { RiScan2Fill } from 'react-icons/ri';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const currentPath = location.pathname;
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
    ...(user?.role === 'doctor' || user?.role === 'super admin' ? [{ name: 'Appointments', icon: <FiCalendar />, path: '/appointments' }] : []),
    { name: 'Patients', icon: <FiUser />, path: '/patients' },
    { name: 'Reports', icon: <FiBook />, path: '/reports' },
    { name: 'Pharmacy', icon: <GiMedicines />, path: '/pharmacy' },
    { name: 'Laboratory', icon: <GiMicroscope />, path: '/laboratory' },
    { name: 'Ultrasound', icon: <RiScan2Fill />, path: '/ultrasound' },
    ...(user?.role === 'xray' || user?.role === 'super admin' ? [{ name: 'X-Ray', icon: <RiScan2Fill />, path: '/xray' }] : []),
    ...(user?.role === 'cashier' || user?.role === 'super admin' ? [{ name: 'Cashier', icon: <FiBook />, path: '/cashier' }] : []),
    { name: 'Logout', icon: <FiLogOut />, path: '/login', action: () => { logout(); navigate("/login", { replace: true }); } },
  ];

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="relative w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 shadow-lg z-50 border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide text-white">
            <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto rounded-lg shadow-md" />
          </Link>
        </div>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded-lg hover:bg-blue-800 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>

        {/* Minimalist Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-end items-center">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <div key={item.name} className="group relative">
                  <button
                    onClick={() => {
                      if (item.action) item.action();
                      else navigate(item.path);
                    }}
                    className={`flex items-center justify-center px-3 py-2 rounded-lg transition-all duration-200
                      ${isActive
                        ? 'bg-white text-blue-800 shadow-md'
                        : 'bg-blue-600 text-white hover:bg-blue-800'}
                    `}
                    style={{ width: 48, height: 48 }}
                  >
                    <span className="text-xl">{item.icon}</span>
                  </button>
                  {/* Tooltip on hover */}
                  <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1 rounded bg-blue-900 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 shadow-2xl z-50 transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ borderLeft: '2px solid #1e3a8a' }}
      >
        <div className="flex flex-col h-full py-6 px-4 space-y-2">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white" onClick={() => setIsOpen(false)}>
              <img src={logo} alt="ClinicPal Logo" className="h-8 w-auto rounded-lg shadow-md" />
            </Link>
            <button
              className="p-2 rounded-lg hover:bg-blue-900 transition"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action) item.action();
                    else navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
                    ${isActive
                      ? 'bg-white text-blue-800 shadow'
                      : 'bg-blue-700 text-white hover:bg-blue-900 hover:text-yellow-300'}
                  `}
                  style={{ minWidth: 120, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="truncate">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
