'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function AdminBreadcrumb() {
  const pathname = usePathname();
  
  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = () => {
    const segments = pathname.split('/').filter(segment => segment);
    const breadcrumbs = [];
    
    // Always start with Dashboard
    breadcrumbs.push({
      name: 'Dashboard',
      href: '/admin',
      current: pathname === '/admin'
    });
    
    if (pathname !== '/admin') {
      let currentPath = '';
      
      for (let i = 1; i < segments.length; i++) {
        currentPath += `/${segments[i]}`;
        const fullPath = `/admin${currentPath}`;
        const isLast = i === segments.length - 1;
        
        // Format segment name
        let name = segments[i]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        // Handle special cases
        if (name === 'Hero Section') name = 'Hero Section';
        if (name === 'Stats Section') name = 'Stats Section';
        if (name === 'Events Section') name = 'Events Section';
        if (name === 'Daily Activities') name = 'Daily Activities';
        if (name === 'Volunteer Opportunities') name = 'Volunteer Opportunities';
        if (name === 'Impact Section') name = 'Impact Section';
        if (name === 'Featured Causes') name = 'Featured Causes';
        if (name === 'Call To Action') name = 'Call to Action';
        
        breadcrumbs.push({
          name,
          href: fullPath,
          current: isLast
        });
      }
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div className="flex items-center">
            <Home className="flex-shrink-0 h-4 w-4 text-gray-400" />
          </div>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.href}>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400" />
              {breadcrumb.current ? (
                <span className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link
                  href={breadcrumb.href}
                  className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}