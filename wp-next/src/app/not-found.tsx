import Link from 'next/link';

import LandingLayout from '@/components/layouts/Landing';

export default function NotFound() {
  return (
    <LandingLayout>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
          <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          <p className="mt-4 text-xl">
            The page you're looking for doesn't exist.
          </p>
          <Link href="/" className="mt-4 text-blue-500 hover:underline">
            Return Home
          </Link>
        </div>
      </main>
    </LandingLayout>
  );
}
