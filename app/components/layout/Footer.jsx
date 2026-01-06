import Link from "next/link";
import { Instagram, X } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">👕</span>
              <span
                className="font-bold
                text-[clamp(1.4rem,3vw,1.8rem)]"
              >
                SetPiece
              </span>
            </div>

            <p
              className="text-gray-400 max-w-xs mb-6
              text-[clamp(0.8rem,1.3vw,0.95rem)]"
            >
              Premium soccer apparel for the modern football fan.
              Authentic quality, streetwear style.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="border border-white/20 p-2 rounded-md
                hover:bg-white hover:text-black transition cursor-pointer"
              >
                <Instagram size={18} />
              </a>

              <a
                href="#"
                aria-label="X"
                className="border border-white/20 p-2 rounded-md
                hover:bg-white hover:text-black transition cursor-pointer"
              >
                <X size={18} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <FooterColumn title="SHOP">
            <FooterLink href="/collections/jerseys">Jerseys</FooterLink>
            <FooterLink href="/collections/shorts">Shorts</FooterLink>
            <FooterLink href="/collections/hoodies">Hoodies</FooterLink>
            <FooterLink href="/collections/accessories">Accessories</FooterLink>
            <FooterLink href="/collections/the-vault">The Vault</FooterLink>
          </FooterColumn>

          {/* Support */}
          <FooterColumn title="SUPPORT">
            <FooterLink href="/fit-guide">Fit Guide</FooterLink>
            <FooterLink href="/shipping">Shipping & Returns</FooterLink>
            <FooterLink href="/faq">FAQ</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>

          {/* Trust */}
          <FooterColumn title="TRUST & SAFETY">
            <FooterLink href="/authenticity">
              Authenticity Guarantee
            </FooterLink>
            <FooterLink href="/track-order">Track Item</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
          </FooterColumn>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between gap-6">
          <p
            className="text-gray-500
            text-[clamp(0.7rem,1.2vw,0.85rem)]"
          >
            © {new Date().getFullYear()} SetPiece. All rights reserved.
          </p>

          <p
            className="text-gray-500
            text-[clamp(0.7rem,1.2vw,0.85rem)]"
          >
            US Shipping Only • Authenticity Verified
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Helpers ---------- */

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3
        className="mb-6 tracking-widest
        text-[clamp(0.75rem,1.2vw,0.85rem)]"
      >
        {title}
      </h3>
      <ul className="space-y-4">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }) {
  return (
    <li>
      <Link
        href={href}
        className="text-gray-400 hover:text-white transition
        cursor-pointer
        text-[clamp(0.8rem,1.3vw,0.95rem)]"
      >
        {children}
      </Link>
    </li>
  );
}
