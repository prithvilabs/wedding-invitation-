import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import weddingLogo from '../../assets/wedding-logo.png';

export default function Navigation({ isVisible = true }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [navVisible, setNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { href: '#hero', label: 'HOME' },
    { href: '#countdown', label: 'MUHURTHAM' },
    { href: '#families', label: 'FAMILIES' },
    { href: '#story', label: 'OUR STORY' },
    { href: '#events', label: 'SCHEDULE' },
    { href: '#rsvp', label: 'RSVP' },
  ];

  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Detect Active Section on Scroll
      const scrollPos = currentScrollY + 220;
      for (const link of navLinks) {
        const id = link.href.replace('#', '');
        const section = document.getElementById(id);
        if (section) {
          const top = section.offsetTop;
          const height = section.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }

      // 2. Hide on Scroll Down, Reveal on Scroll Up
      if (currentScrollY > 100 && currentScrollY > lastScrollY && !isMobileOpen) {
        setNavVisible(false);
      } else {
        setNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, lastScrollY, isMobileOpen]);

  if (!isVisible) return null;

  return (
    <motion.header
      className="editorial-header"
      id="editorialHeader"
      initial={{ opacity: 0, y: -20 }}
      animate={{
        opacity: navVisible ? 1 : 0,
        y: navVisible ? 0 : -80
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Subtle Brand Logo */}
      <a href="#hero" className="header-brand-link" aria-label="Prithvi & Harshini Wedding">
        <img
          src={weddingLogo}
          alt="Wedding Monogram Logo"
          className="header-nav-logo"
        />
      </a>

      {/* Desktop Navigation Links */}
      <nav className="header-nav desktop-only" aria-label="Primary Navigation">
        {navLinks.map((link) => {
          const id = link.href.replace('#', '');
          const isActive = activeSection === id;
          return (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
            >
              <span>{link.label}</span>
              {isActive && (
                <motion.span
                  className="nav-active-line"
                  layoutId="activeNavLine"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>

      {/* Mobile Menu Toggle Button */}
      <div className="header-controls">
        <button
          type="button"
          className={`mobile-toggle-lucide ${isMobileOpen ? 'open' : ''}`}
          aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileOpen}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? (
            <X size={22} strokeWidth={1.75} />
          ) : (
            <Menu size={22} strokeWidth={1.75} />
          )}
        </button>
      </div>

      {/* Mobile Dropdown Menu (Framer Motion) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="mobile-nav-panel"
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {navLinks.map((link) => {
              const id = link.href.replace('#', '');
              const isActive = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`mobile-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="mobile-active-dot" />}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
