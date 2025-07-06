import { useState } from 'react';
import {
  FiMenu,
  FiHome,
  FiCalendar,
  FiUser,
  FiSettings,
  FiLogOut,
  FiBook,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: <FiHome />, onClick: () => navigate('/dashboard') },
    { name: 'Appointments', icon: <FiCalendar />, onClick: () => navigate('/appointments') },
    { name: 'Patients', icon: <FiUser />, onClick: () => navigate('/patients') },
    { name: 'Reports', icon: <FiBook />, onClick: () => navigate('/reports') },
    { name: 'Settings', icon: <FiSettings />, onClick: () => navigate('/settings') },
    { name: 'Logout', icon: <FiLogOut />, onClick: () => { logout(); navigate('/login'); } },
  ];

  return (
    <nav className="relative w-full bg-blue-600 text-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* App Logo or Title */}
        <div className="flex items-center space-x-3">
          <FiMenu className="md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
          <span className="text-xl font-bold tracking-wide">ClinicPal</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={item.onClick}
              className="flex items-center space-x-2 hover:text-blue-100 transition"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-blue-700 px-4 py-4 space-y-3 md:hidden">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 text-left hover:text-blue-100"
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
