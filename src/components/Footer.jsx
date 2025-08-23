import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Calendar,
  Users,
  Award,
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Main Footer Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white">EazyFest</h3>
            </div>
            <p className="text-slate-400 mb-4 leading-relaxed">
              Streamlining college event management with innovative solutions
              for students, faculty, and administrators.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                "Dashboard",
                "Browse Events",
                "My Registrations",
                "Event Calendar",
                "Help Center",
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                "Contact Us",
                "FAQ",
                "Technical Support",
                "Privacy Policy",
                "Terms of Service",
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <MapPin className="w-4 h-4 text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-slate-400 text-sm">
                  123 University Avenue
                  <br />
                  College Campus, State 12345
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 text-blue-400 mr-3 flex-shrink-0" />
                <p className="text-slate-400 text-sm">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-blue-400 mr-3 flex-shrink-0" />
                <p className="text-slate-400 text-sm">support@eazyfest.edu</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: Calendar,
                color: "blue",
                number: "500+",
                label: "Events Managed",
              },
              {
                icon: Users,
                color: "green",
                number: "10,000+",
                label: "Student Registrations",
              },
              {
                icon: Award,
                color: "purple",
                number: "50+",
                label: "Partner Organizations",
              },
            ].map(({ icon: Icon, color, number, label }, idx) => (
              <div key={idx} className="flex items-center justify-center">
                <div
                  className={`w-10 h-10 bg-${color}-600/20 rounded-lg flex items-center justify-center mr-3`}
                >
                  <Icon className={`w-5 h-5 text-${color}-400`} />
                </div>
                <div className="text-left">
                  <p className="text-2xl font-bold text-white">{number}</p>
                  <p className="text-slate-400 text-sm">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm mb-2 md:mb-0">
              &copy; {currentYear} EazyFest - College Event Management System.
              All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Accessibility
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Site Map
              </a>
              <div className="text-slate-500">v2.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
