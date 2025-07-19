import { useState, useEffect } from 'react';
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBook,
} from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/logo1.png";
import { BiInjection } from 'react-icons/bi';
import { GiMedicines, GiMicroscope } from 'react-icons/gi';


const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();


  const currentPath = location.pathname;

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, path: '/dashboard' },
  ...(user?.role === 'doctor' ? [{ name: 'Appointments', icon: <FiCalendar />, path: '/appointments' }] : []),
    { name: 'Patients', icon: <FiUser />, path: '/patients' },
    { name: 'Reports', icon: <FiBook />, path: '/reports' },
    { name: 'Pharmacy', icon: <GiMedicines />, path: '/pharmacy' },
    { name: 'Laboratory', icon: <GiMicroscope />, path: '/laboratory' },
    { name: 'Ultrasound', icon: <FiSettings />, path: '/ultrasound' },
    { name: 'Logout', icon: <FiLogOut />, path: '/login', action: logout },
  ];

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <nav className="relative w-full bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Logo or Title */}
        <div className="flex items-center space-x-3">
          <FiMenu className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
          <Link to="/" className="text-xl font-bold tracking-wide">
            <img src={logo} alt="ClinicPal Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (item.action) item.action();
                  navigate(item.path);
                }}
                className={`flex items-center space-x-2 transition ${
                  isActive ? 'bg-blue-800 px-2 py-1 rounded font-semibold' : 'hover:text-blue-100'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-blue-700 px-4 py-4 space-y-3 md:hidden">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    if (item.action) item.action();
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 text-left transition ${
                    isActive ? 'text-yellow-300 font-semibold' : 'hover:text-blue-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
