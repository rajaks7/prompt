import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Library, PlusSquare, Settings } from 'lucide-react';

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Library', path: '/library', icon: Library },
  { label: 'Create', path: '/create', icon: PlusSquare },
  { label: 'Admin', path: '/admin', icon: Settings },
];

const Logo = () => (
    <div className="flex items-center space-x-3">
        <img src="/logo.svg" alt="R Prompt Manager Logo" className="h-8 w-8" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}/>
        <div className="p-2 bg-indigo-600 rounded-lg shadow-md" style={{display: 'none'}}>
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 3.11C13.34 3.04 12.67 3 12 3C7.58 3 4 6.58 4 11C4 12.84 4.63 14.5 5.69 15.81L4.22 17.28C2.81 15.45 2 13.33 2 11C2 5.48 6.48 1 12 1C13.53 1 14.96 1.34 16.24 1.91L14.81 3.34C14.54 3.23 14.27 3.16 14 3.11Z" fill="white"/>
                <path d="M21.78 17.28L19.31 14.81C20.37 13.5 21 11.84 21 10C21 8.66 20.66 7.41 20.09 6.26L21.5 4.84C22.66 6.24 23 8.04 23 10C23 12.76 21.6 15.14 19.78 16.72L21.22 18.16C21.53 17.85 21.66 17.56 21.78 17.28Z" fill="white"/>
                <path d="M12 5C9.24 5 7 7.24 7 10C7 11.05 7.33 12.03 7.88 12.81L9.3 11.4C9.11 11 9 10.51 9 10C9 8.34 10.34 7 12 7C12.51 7 13 7.11 13.4 7.3L14.81 5.88C13.97 5.33 13.01 5 12 5Z" fill="white"/>
                <path d="M17.73 13.3C17.9 12.71 18 12.1 18 11.49C18 9.58 17.13 7.91 15.73 6.87L14.27 8.33C15.09 9.09 15.5 10.22 15.5 11.49C15.5 11.78 15.46 12.06 15.4 12.33L17.73 13.3Z" fill="white"/>
            </svg>
        </div>
        <span className="text-xl font-bold text-gray-800">Prompt Manager</span>
    </div>
);

const SidebarNavigation = () => {
  return (
    <aside className="w-64 bg-white shadow-lg flex-shrink-0 flex-col z-10 hidden md:flex">
      <div className="p-4 border-b h-20 flex items-center">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
};

const NavItem = ({ label, path, icon: Icon }) => {
  return (
    <NavLink
      to={path}
      end={path === '/dashboard'}
      className={({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200
         ${isActive ? 'bg-indigo-50 text-indigo-600 font-semibold' : ''}`
      }
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarNavigation;