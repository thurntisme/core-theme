'use client';

import { useState } from 'react';
import { Button } from 'react-day-picker';

import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

import ContactForm from '@/components/landing/ContactForm';
import { DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { ADMIN_EMAIL, SOCIAL_LINKS } from '@/constants/landing';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@radix-ui/react-dialog';

export default function ContactPage() {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleFormSuccess = () => {
    setShowSuccessDialog(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12 sm:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto"
          >
            Have a project in mind or want to discuss a potential collaboration?
            I'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:order-2"
          >
            <div className="bg-card rounded-xl shadow-sm p-6 sm:p-8 border">
              <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">
                Send a Message
              </h2>
              <ContactForm onFormSuccess={handleFormSuccess} />
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:order-1"
          >
            <h2 className="text-2xl sm:text-3xl font-display font-bold mb-6">
              Contact Information
            </h2>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-12">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">Email</h3>
                  <a
                    href={`mailto:${ADMIN_EMAIL}`}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
                  >
                    {ADMIN_EMAIL}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">
                    Location
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    San Francisco, California, USA
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold">Phone</h3>
                  <a
                    href="tel:+15551234567"
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              Connect with Me
            </h3>

            <div className="flex space-x-3 sm:space-x-4 mb-8 sm:mb-12">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
                  aria-label="GitHub"
                >
                  {item.icon}
                </a>
              ))}
            </div>

            <div className="mt-8 sm:mt-12">
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Availability
              </h3>
              <div className="bg-secondary/50 rounded-lg p-4">
                <p className="text-muted-foreground text-sm sm:text-base">
                  Currently available for freelance projects and full-time
                  opportunities. I typically respond to inquiries within 24-48
                  hours.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Message Sent Successfully!
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Thank you for reaching out. I'll get back to you as soon as
              possible, usually within 24-48 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="text-sm sm:text-base"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
