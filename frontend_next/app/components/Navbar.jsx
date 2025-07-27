"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiMoon } from 'react-icons/hi2';
import authService from '../services/auth';

const Navbar = () => {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Logout', onClick: handleLogout, href: '/' },
  ];

  return (
    <nav className="bg-indigo-700 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-white text-2xl font-bold hover:text-indigo-100 transition duration-300">
          TaskFlow
        </Link>
        <div className="flex space-x-4 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={link.onClick}
              className={`text-white px-3 py-2 rounded-md text-sm font-medium transition duration-300
                          ${pathname === link.href ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <button
          onClick={() => document.documentElement.classList.toggle('dark')}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-200"
          aria-label="Toggle dark mode"
        >
          <HiMoon className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

