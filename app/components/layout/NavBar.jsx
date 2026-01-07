"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";

const categories = [
  { label: "New Arrivals", handle: "new-arrivals" },
  { label: "Shorts", handle: "soccer-shorts" },
  { label: "Hoodies", handle: "hoodies-joggers" },
  { label: "Accessories", handle: "accessories" },
];

const navItems = [
  { label: "SHORTS", handle: "soccer-shorts" },
  { label: "HOODIES", handle: "hoodies-joggers" },
  { label: "ACCESSORIES", handle: "accessories" },
  { label: "THE VAULT", handle: "the-vault" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 hidden md:flex items-center justify-between">
        {/* Categories Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 font-medium cursor-pointer select-none"
            aria-expanded={open}
          >
            <Menu size={20} />
            <span className="hidden sm:inline text-md font-bold">CATEGORIES</span>
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute left-0 mt-3 w-56 bg-white border rounded-md shadow-lg z-50">
              <ul className="py-2">
                {categories.map((cat) => (
                  <li key={cat.handle}>
                    <Link
                      href={`/collections/${cat.handle}`}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2 text-sm  hover:bg-gray-100 cursor-pointer"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-md font-semibold uppercase">
          {navItems.map((item) => (
            <Link
              key={item.handle}
              href={`/collections/${item.handle}`}
              className="hover:text-gray-600 cursor-pointer font-bold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Featured */}
        <Link
          href="/collections/girls-collections"
          className="text-md font-bold uppercase cursor-pointer "
        >
          GIRLS COLLECTION
        </Link>
      </div>
    </div>
  );
}