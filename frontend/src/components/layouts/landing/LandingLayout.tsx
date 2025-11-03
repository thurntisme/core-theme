import { Outlet } from 'react-router-dom';

import { motion } from 'framer-motion';

import Footer from './Footer';
import Navbar from './Navbar';
import Providers from './Providers';

type Props = {};

const LandingLayout = (props: Props) => {
  return (
    <Providers>
      <div className="min-h-screen bg-background">
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className={`mx-auto w-full py-8`}
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
    </Providers>
  );
};

export default LandingLayout;
