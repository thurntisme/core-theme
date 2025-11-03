import React from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  externalLink?: string;
  index?: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  slug,
  title,
  description,
  category,
  image,
  externalLink,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.1 * index,
      }}
      className="group hover:scale-[1.02] transition-transform duration-300 relative flex flex-col h-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow-lg hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col space-y-2 p-6">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
            {category}
          </span>
        </div>
        <Link to={`/projects/${slug}`} className="block">
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
        </Link>
        <p className="text-muted-foreground line-clamp-2">{description}</p>
        <div className="mt-4 flex items-center justify-between">
          <Link to={`/projects/${slug}`} className="block">
            <span className="flex items-center text-sm font-medium text-primary">
              <span className="link-underline">View Project</span>
              <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          {externalLink && (
            <a
              href={externalLink}
              className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="mr-1 link-underline">Visit</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
