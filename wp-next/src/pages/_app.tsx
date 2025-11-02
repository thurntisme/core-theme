import React from 'react';

import type { AppProps } from 'next/app';

type AppPropsWithLayout = AppProps & {
  Component: AppProps['Component'] & {
    getLayout?: () => React.ReactNode;
  };
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page: any) => page);

  return getLayout(<Component {...pageProps} />);
}
