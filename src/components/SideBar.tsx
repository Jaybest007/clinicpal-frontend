import { useState } from 'react';
import { FiMenu, FiHome, FiCalendar, FiUser, FiSettings } from 'react-icons/fi';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: <FiHome /> },
    { name: 'Appointments', icon: <FiCalendar /> },
    { name: 'Patients', icon: <FiUser /> },
    { name: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <>
      {/* Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-40 md:hidden bg-white p-2 rounded shadow"
      >
        <FiMenu size={20} />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-blue-300 shadow-md z-30 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-48' : 'w-16'} md:w-48`}
      >
        <div className="flex flex-col items-center md:items-start px-4 py-6">
          {navItems.map((item) => (
            <div
              key={item.name}
              className="flex items-center w-full py-2 px-2 rounded  hover:bg-blue-200  cursor-pointer transition"
            >
              <div className="text-blue-800 bg-white p-2 rounded-2xl">{item.icon}</div>
              <span className={`ml-3 text-blue-50 text-sm hover:text-blue-800  ${isOpen ? 'block' : 'hidden'} md:block`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
