import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-purple-bright/10 bg-panel/40 mt-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-16 grid md:grid-cols-3 gap-12">
        <div id="about">
          <h2 className="font-display text-2xl mb-2 text-gradient">Contact Us</h2>
          <p className="text-white/50 text-sm mb-6 max-w-sm">
            Top Headlines is a digital library for discovering and downloading
            important documents — built for readers who want the primary
            source, not just the summary.
          </p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 text-white/60">
              <MapPin className="w-4 h-4 text-purple-bright" />
              12, Washington DC, California
            </li>
            <li>
              <a
                href="tel:+12387988"
                className="flex items-center gap-2 text-white/60 hover:text-neon transition-colors w-fit"
              >
                <Phone className="w-4 h-4 text-purple-bright" />
                +1 2387988
              </a>
            </li>
            <li>
              <a
                href="mailto:readin@gmail.com"
                className="flex items-center gap-2 text-white/60 hover:text-neon transition-colors w-fit"
              >
                <Mail className="w-4 h-4 text-purple-bright" />
                readin@gmail.com
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/" className="hover:text-neon transition-colors">Home</Link></li>
            <li><Link href="/documents" className="hover:text-neon transition-colors">Documents</Link></li>
            <li><Link href="/#about" className="hover:text-neon transition-colors">About</Link></li>
            <li><Link href="/#contact" className="hover:text-neon transition-colors">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-neon transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-neon transition-colors">Terms &amp; Conditions</Link></li>
            <li><Link href="/admin" className="hover:text-neon transition-colors">Admin</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm uppercase tracking-widest text-white/40 mb-4">Follow</h3>
          <div className="flex gap-3">
            {/* Placeholder links — replace with real profile URLs once configured. */}
            <a href="#" aria-label="Instagram" className="p-2.5 rounded-full glass hover:text-neon hover:shadow-glow-yellow transition-all">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" aria-label="X (Twitter)" className="p-2.5 rounded-full glass hover:text-neon hover:shadow-glow-yellow transition-all">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2.5 rounded-full glass hover:text-neon hover:shadow-glow-yellow transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" aria-label="YouTube" className="p-2.5 rounded-full glass hover:text-neon hover:shadow-glow-yellow transition-all">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <div className="mx-auto max-w-7xl px-5 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span className="font-[var(--font-cursive)] italic text-base text-white/60">
            Top Headlines — Read. Discover. Download.
          </span>
          <span>© 2026 Top Headlines. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
