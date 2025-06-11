
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Users, Calendar, Settings, User } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: BarChart3,
      current: location.pathname === '/'
    },
    {
      name: 'Client Data',
      href: '/clients',
      icon: Users,
      current: location.pathname === '/clients'
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: Calendar,
      current: location.pathname === '/calendar'
    }
  ];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">SalesTracker</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    item.current
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Welcome, John Doe</span>
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center space-x-4 pb-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
