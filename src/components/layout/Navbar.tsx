import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/map', label: 'Map' },
  { to: '/cities', label: 'Cities' },
  { to: '/factions', label: 'Factions & Houses' },
  { to: '/gods', label: 'Pantheon' },
  { to: '/cosmology', label: 'Cosmology' },
  { to: '/calendar', label: 'Calendar' },
];

export function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-codex-void/95 backdrop-blur border-b border-codex-border">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <Link to="/" className="font-display text-codex-gold text-lg hover:text-codex-goldLight transition-colors">
          The Chalesian Codex
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-display relative transition-colors duration-150 ${
                location.pathname === link.to
                  ? 'text-codex-gold'
                  : 'text-codex-parchmentDim hover:text-codex-parchment'
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-codex-gold"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-codex-parchmentDim p-2"
          onClick={() => setMenuOpen(o => !o)}
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden border-t border-codex-border bg-codex-dark"
        >
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-3 text-sm font-display border-b border-codex-border/50 ${
                location.pathname === link.to ? 'text-codex-gold' : 'text-codex-parchmentDim'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}
