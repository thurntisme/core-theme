'use client';

import React from 'react';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Code,
  Coffee,
  Cpu,
  Gamepad2,
  Heart,
  Lightbulb,
  Rocket,
} from 'lucide-react';
import Link from 'next/link';

import LandingWrapper from '@/components/layouts/LandingWrapper';

const codingSuperpowers = [
  'Turning coffee into code',
  'Debugging at 3 AM',
  'Finding missing semicolons',
  'Explaining technical stuff to cats',
  'Stack Overflow speed-reading',
  'Making computers do cool things',
  'Pixel-perfect CSS wizardry',
  'Turning ideas into clickable things',
];

export default function About() {
  return (
    <LandingWrapper>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            About Me
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
          >
            Get to know me, my background, and what drives my passion for design
            and development.
          </motion.p>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:w-1/3"
          >
            <div className="sticky top-24 overflow-hidden rounded-xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Profile"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:w-2/3"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-4">
              Hi, I'm <span className="text-gradient">Jane Doe</span>
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              I'm a passionate web developer and designer with over 5 years of
              experience creating beautiful, functional websites and
              applications. I specialize in front-end development, with
              expertise in React, TypeScript, and modern CSS frameworks.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              My journey in tech began during college, where I discovered my
              love for the perfect blend of logical problem-solving and creative
              expression that web development offers. Since then, I've worked
              with startups, agencies, and established companies to deliver
              exceptional digital experiences.
            </p>
            <p className="text-muted-foreground text-sm sm:text-base mb-6 sm:mb-8">
              When I'm not coding, you can find me exploring nature trails,
              reading science fiction, or experimenting with new recipes in the
              kitchen.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-11 sm:h-12 px-6 sm:px-8 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm sm:text-base"
            >
              Get in Touch <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>

        {/* Developer Superpower Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 text-center flex items-center justify-center">
            <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-yellow-400" />
            Developer Superpowers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {codingSuperpowers.map((power, index) => (
              <motion.div
                key={power}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                className="bg-gradient-to-r from-secondary/80 to-secondary rounded-lg p-3 sm:p-4 flex items-center gap-3 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <p className="font-medium text-sm sm:text-base">{power}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Life of a Developer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 flex items-center justify-center">
            <Coffee className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-amber-600" />A
            Day in My Developer Life
          </h2>

          <div className="bg-secondary/50 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Coffee className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    8:00 AM: Caffeination Protocol
                  </h3>
                  <p className="mt-1 text-sm sm:text-base">
                    Coffee first, then code. These are the sacred rules of
                    programming. One does not simply write code without coffee.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Code className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    10:00 AM: Bug Hunting Season
                  </h3>
                  <p className="mt-1 text-sm sm:text-base">
                    I transform into a digital detective, hunting down bugs that
                    are hiding in the darkest corners of my code. "Elementary,
                    my dear console.log()!"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    2:00 PM: The Implementation Zone
                  </h3>
                  <p className="mt-1 text-sm sm:text-base">
                    Peak focus achieved. Headphones on, world off. This is when
                    I build digital experiences that make users go "Wow, that's
                    so cool!"
                  </p>
                </div>
              </div>

              <div className="flex gap-3 sm:gap-4 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                  <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-rose-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold">
                    7:00 PM: Creative Recharge
                  </h3>
                  <p className="mt-1 text-sm sm:text-base">
                    Recharging creative batteries with video games, books or
                    experimental side projects. Sometimes the best code
                    solutions come when you're not actively thinking about them!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Facts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6 flex items-center justify-center">
            <Heart className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-red-500" />
            Fun Developer Facts
          </h2>
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-4 sm:p-6 shadow-md">
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-white dark:bg-secondary/70 rounded-lg p-3 sm:p-4 shadow-sm">
                <p className="font-medium text-sm sm:text-base">
                  I've named all my debugging rubber ducks after famous
                  scientists.
                </p>
              </div>
              <div className="bg-white dark:bg-secondary/70 rounded-lg p-3 sm:p-4 shadow-sm">
                <p className="font-medium text-sm sm:text-base">
                  I once fixed a critical bug using code I dreamt about. True
                  story!
                </p>
              </div>
              <div className="bg-white dark:bg-secondary/70 rounded-lg p-3 sm:p-4 shadow-sm">
                <p className="font-medium text-sm sm:text-base">
                  My personal record: 17 browser tabs open while debugging a
                  single function.
                </p>
              </div>
              <div className="bg-white dark:bg-secondary/70 rounded-lg p-3 sm:p-4 shadow-sm">
                <p className="font-medium text-sm sm:text-base">
                  I celebrate successful deployments with a victory dance. No
                  one has seen it... yet.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </LandingWrapper>
  );
}
