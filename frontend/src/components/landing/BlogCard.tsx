import React from 'react';
import { Link } from 'react-router-dom';

import { motion } from 'framer-motion';
import { Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  index?: number;
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  excerpt,
  date,
  readTime,
  category,
  image,
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
      className="group"
    >
      <Link to={`/blog/${slug}`} className="block h-full">
        <div className="relative flex flex-col h-full overflow-hidden rounded-lg border bg-card text-card-foreground shadow">
          <div className="relative h-48 overflow-hidden">
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                {category}
              </span>
            </div>
            <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard;
