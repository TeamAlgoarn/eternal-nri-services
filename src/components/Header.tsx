
"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/Icons";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#about" },
  { label: "Our Services", href: "#services" },
  { label: "Why Choose Us", href: "#why-us" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* Official Company Logo */}
        <a
          href="#home"
          className="brand brand-official"
          aria-label="Eternal NRI Services - Home"
          onClick={closeMenu}
        >

<Image
  src="/ens-logo.jpeg"
  alt="Eternal NRI Services Official Logo"
  width={2600}
  height={1600}
  priority
  className="official-logo"
/>

        </a>

        {/* Desktop and Mobile Navigation */}
        <nav
          className={`navigation ${open ? "navigation-open" : ""}`}
          id="primary-navigation"
          aria-label="Primary navigation"
        >
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}

          <a
            className="mobile-contact"
            href="#contact"
            onClick={closeMenu}
          >
            Get in touch
          </a>
        </nav>

        {/* Desktop Contact Button */}
        <a
          className="button button-small header-cta"
          href="#contact"
        >
          Get in touch
          <Icon name="arrow" size={17} />
        </a>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-toggle"
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>

      </div>
    </header>
  );
}
