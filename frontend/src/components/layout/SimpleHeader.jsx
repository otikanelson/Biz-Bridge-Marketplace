import { useNavigate } from 'react-router-dom';

const SimpleHeader = ({ activePage = '' }) => {
  const navigate = useNavigate();

  const navLinks = [
    { label: 'SignUp as customer', path: '/signup?type=customer', key: 'customer' },
    { label: 'SignUp as artisan',   path: '/signup?type=artisan',   key: 'artisan'   },
    { label: 'Log in',   path: '/login',   key: 'login'   },
  ];

  return (
    <header className="bg-black text-white w-full top-0 z-10 fixed">
      <div className="py-2">
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-red-500 text-4xl select-none font-bold">𐐒</span>
            <span className="text-white text-3xl select-none font-bold">B</span>
            <span className="text-red-500 text-lg select-none font-semibold ml-3">BizBridge</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks
              .filter(({ key }) => key !== activePage)
              .map(({ label, path, key }) => (
                <span
                  key={key}
                  onClick={() => navigate(path)}
                  className="cursor-pointer transition hover:text-red-400"
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
