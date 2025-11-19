import { CONTACT } from "@/config/data";
import { cn } from "@/lib/utils";
import { Facebook, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer({ className }) {
  return (
    <footer className={cn(`bg-primary text-primary-foreground `, className)}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <img src="/logo.jpeg" alt="Logo" className="max-w-40 rounded-2xl" />
            <div className="flex gap-3">
              <a
                href={CONTACT.socialLinks.facebookPage}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={CONTACT.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/courses"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/notes"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Notes
                </Link>
              </li>
              <li>
                <Link
                  to="/books"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Books
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about-us"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/privacy-policy"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-conditions"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/return-refund-policy"
                  className="text-primary-foreground/80 hover:text-secondary transition-colors text-sm"
                >
                  Return & Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-primary-foreground/80">
                <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div>
                  <span className="block">{CONTACT.address}</span>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>{CONTACT.phone}</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/80">
                <Mail className="w-5 h-5 text-secondary flex-shrink-0" />
                <span>{CONTACT.email}</span>
              </li>
              <li className="text-xs text-primary-foreground/60 mt-3">
                {/* <strong>TIN:</strong> {CONTACT.tin} */}
                <strong>Trade License:</strong> {CONTACT.tradeLicense}
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Gateway Information Banner */}
        <div className="border-t border-primary/20 pt-6 mt-8">
          <div className="bg-gradient-to-l from-secondary/10 to-primary/10 rounded-lg p-4 mb-6">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex items-center justify-center gap-2">
                <img
                  src="/Payment3.png"
                  alt="Payment Methods"
                  className="block sm:hidden  object-contain"
                />

                <img
                  src="/payment0.png"
                  alt="Payment Methods"
                  className="hidden sm:block   object-contain"
                />

                {/* <img
                  src="/Payment4.png"
                  alt="Payment Methods"
                  className="hidden sm:block lg:hidden  object-contain"
                />
                <img
                  src="/Payment2.png"
                  alt="Payment Methods"
                  className="hidden lg:block 2xl:hidden  object-contain"
                />
                <img
                  src="/Payment1.png"
                  alt="Payment Methods"
                  className="hidden 2xl:block object-contain"
                /> */}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © {new Date().getFullYear()} প্রতিজ্ঞা. All rights reserved.
            </p>
            <div className=" text-sm text-primary-foreground/60">
              Developed by{" "}
              <a
                href="http://enovosoft.com/"
                className="text-primary-foreground/80 hover:underline hover:text-primary-foreground"
              >
                Enovosoft
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
