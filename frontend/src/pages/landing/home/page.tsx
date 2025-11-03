import ContactCTA from '@/components/landing/ContactCTA';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import Hero from '@/components/landing/Hero';
import RecentBlog from '@/components/landing/RecentBlog';

type Props = {};

const HomePage = (props: Props) => {
  return (
    <>
      <Hero />

      {/* Featured Projects Section */}
      <FeaturedProjects />

      {/* Recent Blog Posts Section */}
      <RecentBlog />

      {/* Contact CTA Section */}
      <ContactCTA />
    </>
  );
};

export default HomePage;
