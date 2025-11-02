import React from 'react';

import LandingLayout from '@/components/layouts/Landing';

type Props = {
  children: React.ReactNode;
};

const LandingWrapper = ({ children }: Props) => {
  return (
    <LandingLayout>
      <div className="py-12 sm:py-16 lg:py-20">{children}</div>
    </LandingLayout>
  );
};

export default LandingWrapper;
