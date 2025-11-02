import { Metadata } from 'next';

// Sample project data (in a real app, this would come from an API or CMS)
const project = {
  id: '1',
  title: 'E-commerce Platform',
  description:
    'A modern e-commerce platform built with Next.js and Stripe integration.',
  image:
    'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
};

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  // In a real app, you would fetch the project data here
  // For now, we'll use the sample data
  const projectData = project;

  return {
    title: `${projectData.title} | Thurntisme`,
    description: projectData.description,
    openGraph: {
      title: `${projectData.title} | Thurntisme`,
      description: projectData.description,
      images: [projectData.image],
      type: 'article',
    },
  };
}
