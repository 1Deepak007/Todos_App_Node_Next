"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation'; // Hook to get current path

const Navbar = () => {
  const pathname = usePathname(); // Get the current active path

  const navLinks = [
    // { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
    { name: 'Logout', href: '/signuplogin' },
    // { name: 'Profile', href: '/profile' }
  ];

  return (
    <nav className="bg-indigo-700 p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="" className="text-white text-2xl font-bold hover:text-indigo-100 transition duration-300">
          TaskFlow
        </Link>
        <div className="flex space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              // Apply 'active' class based on current pathname
              className={`text-white px-3 py-2 rounded-md text-sm font-medium
                          ${pathname === link.href ? 'bg-indigo-800' : 'hover:bg-indigo-600'}
                          transition duration-300`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;