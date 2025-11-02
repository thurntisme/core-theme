import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">Thurntisme</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/about"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                About
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Projects
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Blog
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
