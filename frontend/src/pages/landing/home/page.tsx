import ContactCTA from '@/components/landing/ContactCTA';
import FeaturedProjects from '@/components/landing/FeaturedProjects';
import Hero from '@/components/landing/Hero';
import RecentBlog from '@/components/landing/RecentBlog';

const HomePage = () => {
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
