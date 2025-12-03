'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/UserContext'
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const FooterLink = ({ href, children }) => (
  <Link 
    href={href} 
    className="text-gray-300 hover:text-white transition-colors duration-300 text-sm md:text-base py-1"
  >
    {children}
  </Link>
);

const SocialIcon = ({ icon, href, label }) => (
  <motion.a
    href={href}
    aria-label={label}
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ y: -3, scale: 1.1 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white/10 p-2.5 rounded-full hover:bg-white/20 transition-colors duration-300"
  >
    {icon}
  </motion.a>
);

const Footer = () => {
  const { user } = useAuth();
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [HomePage, setHomePage] = React.useState(false);
  const pathname = usePathname(); 
  
  useEffect(() => {
    if (pathname === '/') {
      setHomePage(true);
    } else {
      setHomePage(false);
    }
  }, [user, pathname]);

  return (
    <footer className="bg-gradient-to-b from-[#00234a] to-[#003161] dark:from-gray-900 dark:to-black text-white">
      {HomePage && ( <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
      >
        <div className="bg-gradient-to-r from-blue-500/20 to-blue-700/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {user?.role === "admin" 
                  ? "Ready to host your next amazing event?"
                  : "Discover events that match your interests"}
              </h2>
              <p className="text-lg md:text-xl text-blue-100">
                {user?.role === "admin"
                  ? "Our platform makes event creation and management simple and stress-free."
                  : "Join thousands finding and booking events they love with just a few clicks."}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(user?.role === "admin" ? "/admin/create-event" : "/events")}
              className="bg-white text-[#003161] hover:bg-blue-50 py-4 px-8 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-lg self-start transition-colors duration-300"
            >
              {user?.role === "admin" ? "Create Event" : "Browse Events"}
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.div> ) }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-6 lg:gap-12 mb-12">
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <h2 className="text-2xl font-bold">Eventify</h2>
            </Link>
            <p className="mt-4 text-gray-300 text-sm md:text-base">
              The premier platform for discovering, creating, and managing events of all sizes.
              From intimate gatherings to large-scale conferences.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <SocialIcon 
                icon={<Facebook size={18} />} 
                href="https://www.facebook.com/rahulrathee07/" 
                label="Facebook" 
              />
              <SocialIcon 
                icon={<Twitter size={18} />} 
                href="https://www.twitter.com/rahul_rathee7" 
                label="Twitter" 
              />
              <SocialIcon 
                icon={<Instagram size={18} />} 
                href="https://instagram.com/rahul._rathee" 
                label="Instagram" 
              />
              <SocialIcon 
                icon={<Linkedin size={18} />} 
                href="https://linkedin.com/in/rahul-rathee7" 
                label="LinkedIn" 
              />
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <div className="flex flex-col">
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/about">About Us</FooterLink>
              <FooterLink href="/blog">Blog</FooterLink>
              <FooterLink href="/contact">Contact</FooterLink>
              {user?.role === "admin" && (
                <FooterLink href="/admin/dashboard">Admin Dashboard</FooterLink>
              )}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Support</h3>
            <div className="flex flex-col">
              <FooterLink href="/help-center">Help Center</FooterLink>
              <FooterLink href="/faq">FAQs</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4 text-white">Stay Updated</h3>
            <p className="text-gray-300 mb-4 text-sm md:text-base">
              Subscribe to our newsletter for the latest events and offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 flex-grow"
                aria-label="Email address for newsletter"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-white text-[#003161] hover:bg-blue-50 px-4 py-2.5 rounded-lg font-medium flex-shrink-0 transition-colors duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
        <div className="h-px w-full bg-white/20 my-6"></div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Eventify. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Privacy
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default React.memo(Footer)