import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight } from 'lucide-react';
import { FAQS } from './constants';

export function LandingFaqs() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section id="faqs" className="relative py-24 sm:py-32 bg-secondary/20 border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-accent">Questions</span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold mt-2 text-foreground">Frequently Asked Questions</h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-4"></div>
        </div>

        <div className="flex flex-col gap-4">
          {FAQS.map((faq, idx) => (
            <div 
              key={idx}
              className="glass-card rounded-xl overflow-hidden border border-border/40"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-secondary/40 transition-colors"
              >
                <span className="font-serif text-lg font-medium text-foreground flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${activeFaq === idx ? 'rotate-90 text-accent' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-border/40 bg-secondary/10"
                  >
                    <p className="p-6 text-sm text-muted-foreground leading-relaxed pl-14">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
