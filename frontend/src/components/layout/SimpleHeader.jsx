/**
 * SimpleHeader — used on pages that don't need a search bar:
 * ContactUs, FAQ, PrivacyPolicy, TermsOfService, Login, Signup, Dashboard, etc.
 *
 * Props:
 *   activePage?: string  — highlights the matching nav link (e.g. 'contact')
 */
import { useNavigate } from 'react-router-dom';

const SimpleHeader = ({ activePage = '' }) => {
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Woodworking', path: '/services?category=Woodworking', key: 'woodworking' },
    { label: 'Metalwork',   path: '/services?category=Metalwork',   key: 'metalwork'   },
    { label: 'Soap Making', path: '/services?category=Soap Making', key: 'soap'        },
    { label: 'Hair Braiding', path: '/services?category=Hair Braiding & Styling', key: 'hair' },
    { label: 'Contact Us',  path: '/contact',                        key: 'contact'     },
  ];

  return (
    <header className="bg-black text-white w-full top-0 z-10 fixed">
      <div className="py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-red-500 text-5xl select-none font-bold">𐐒</span>
            <span className="text-white text-4xl select-none font-bold">B</span>
            <span className="text-red-500 text-2xl select-none font-semibold ml-5">BizBridge</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ label, path, key }) => (
              <span
                key={key}
                onClick={() => navigate(path)}
                className={`cursor-pointer transition ${
                  activePage === key
                    ? 'text-red-400 font-semibold'
                    : 'hover:text-red-400'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SimpleHeader;
