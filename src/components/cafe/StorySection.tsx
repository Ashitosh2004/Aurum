'use client'

import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Coffee, Award, Heart, Quote, ArrowRight } from 'lucide-react'
import { useRef } from 'react'

/* ──────────────────────────── data ──────────────────────────── */

const timelineItems = [
  {
    year: '2019',
    title: 'The Beginning',
    description:
      'Founded with a passion for exceptional coffee and a dream to create a sanctuary for coffee lovers.',
  },
  {
    year: '2020',
    title: 'Our First Roast',
    description:
      'Mastered the art of in-house roasting, bringing out unique flavor profiles from every single origin.',
  },
  {
    year: '2021',
    title: 'Growing Community',
    description:
      '10,000 cups served and counting — our community of coffee enthusiasts continues to flourish.',
  },
  {
    year: '2022',
    title: 'Award Winning',
    description:
      'Recognized as Best Artisan Café by the National Coffee Association for our dedication to craft.',
  },
  {
    year: '2023',
    title: 'Expanding Horizons',
    description:
      'New menu, new experiences — introducing seasonal specials and immersive coffee tasting events.',
  },
  {
    year: '2024',
    title: 'Five Years Strong',
    description:
      'Serving 100K+ happy customers and continuing our pursuit of the perfect cup.',
  },
]

const values = [
  {
    icon: Coffee,
    title: 'Quality First',
    description:
      'We source only the finest premium beans from renowned farms across the globe, ensuring every sip meets our exacting standards.',
  },
  {
    icon: Award,
    title: 'Craftsmanship',
    description:
      'Every drink is a work of art — our baristas undergo rigorous training to master artisan preparation techniques.',
  },
  {
    icon: Heart,
    title: 'Community',
    description:
      'More than a café, we are a gathering place where connections are forged, stories are shared, and friendships blossom.',
  },
]

const processSteps = [
  {
    label: 'Source',
    description: 'Hand-selected beans from world\'s best farms',
  },
  {
    label: 'Roast',
    description: 'Precision roasted in small batches',
  },
  {
    label: 'Brew',
    description: 'Expertly crafted by our baristas',
  },
]

const awards = [
  { title: 'Best Artisan Café 2024', icon: Award },
  { title: 'Excellence in Roasting', icon: Coffee },
  { title: 'Top 10 Cafés', icon: Award },
  { title: 'Sustainability Award', icon: Heart },
]

/* ──────────────────────── sub-components ─────────────────────── */

function TimelineItem({
  item,
  index,
}: {
  item: (typeof timelineItems)[number]
  index: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const isLeft = index % 2 === 0

  return (
    <div
      ref={ref}
      className={`relative flex w-full items-start md:items-center ${
        isLeft ? 'md:justify-start' : 'md:justify-end'
      }`}
    >
      {/* Desktop: alternating layout */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        className="relative max-w-md w-full"
      >
        <div className="rounded-xl bg-white p-6 shadow-soft">
          {/* Year badge */}
          <span className="gradient-gold mb-3 inline-block rounded-full px-4 py-2 font-[family-name:var(--font-playfair)] text-sm font-bold tracking-wide text-white">
            {item.year}
          </span>

          <h3 className="mb-2 font-[family-name:var(--font-playfair)] text-xl font-bold text-coffee-900">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-coffee-600">
            {item.description}
          </p>
        </div>

        {/* Connector dot on the timeline line — desktop only */}
        <div
          className={`absolute top-6 hidden h-4 w-4 rounded-full border-[3px] border-gold-500 bg-cream md:block ${
            isLeft ? '-right-2 translate-x-1/2' : '-left-2 -translate-x-1/2'
          }`}
        />
      </motion.div>
    </div>
  )
}

/* ──────────────────────── main component ─────────────────────── */

export default function StorySection() {
  /* parallax refs */
  const parallaxRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  /* section-level in-view refs */
  const valuesRef = useRef<HTMLDivElement>(null)
  const valuesInView = useInView(valuesRef, { once: true, margin: '-80px' })

  const processRef = useRef<HTMLDivElement>(null)
  const processInView = useInView(processRef, { once: true, margin: '-80px' })

  const awardsRef = useRef<HTMLDivElement>(null)
  const awardsInView = useInView(awardsRef, { once: true, margin: '-60px' })

  const quoteRef = useRef<HTMLDivElement>(null)
  const quoteInView = useInView(quoteRef, { once: true, margin: '-60px' })

  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineInView = useInView(timelineRef, { once: true, margin: '-60px' })

  return (
    <section id="story" aria-label="Our Story">
      {/* ═══════════ 1. Section Header ═══════════ */}
      <div className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-gold-500"
          >
            Since 2019
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-coffee-900 md:text-5xl lg:text-6xl"
          >
            Our{' '}
            <span className="text-gold-500">Story</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-6 h-[2px] w-24 gradient-gold"
          />
        </div>
      </div>

      {/* ═══════════ 2. Parallax Image Section ═══════════ */}
      <div ref={parallaxRef} className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <motion.img
          src="/images/cafe/story-1.png"
          alt="Coffee roasting process"
          className="absolute inset-0 h-[120%] w-full object-cover"
          style={{ y: bgY }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-espresso/60" />
        {/* Content */}
        <div className="relative z-10 flex h-full items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-2xl px-4 text-center"
          >
            <h3 className="mb-4 font-[family-name:var(--font-playfair)] text-3xl font-bold text-gold-400 md:text-4xl lg:text-5xl">
              From Bean to Cup
            </h3>
            <p className="text-base leading-relaxed text-white/85 md:text-lg">
              Every coffee tells a story — from the volcanic highlands of
              Ethiopia to the lush farms of Colombia, we travel the world to
              hand-select beans that meet our uncompromising standards. Each
              origin brings its own character, and our master roasters unlock
              those hidden notes to deliver a cup that is nothing short of
              extraordinary.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══════════ 3. Timeline / Journey Section ═══════════ */}
      <div className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-coffee-900 md:text-3xl">
              Our Journey
            </h3>
            <div className="mx-auto mt-4 h-[2px] w-16 gradient-gold" />
          </motion.div>

          {/* Timeline container */}
          <div ref={timelineRef} className="relative">
            {/* Vertical line (desktop) */}
            <div className="absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-gold-400/0 via-gold-400/40 to-gold-400/0 md:block" />

            {/* Mobile vertical line */}
            <div className="absolute bottom-0 left-6 top-0 w-[2px] bg-gradient-to-b from-gold-400/0 via-gold-400/40 to-gold-400/0 md:hidden" />

            <div className="flex flex-col gap-10 md:gap-14">
              {timelineItems.map((item, i) => (
                <div key={item.year} className="relative flex flex-col md:items-center">
                  {/* Mobile layout — always left-aligned with line on left */}
                  <div className="md:hidden pl-14">
                    <motion.div
                      initial={{ opacity: 0, x: -40 }}
                      animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                      className="rounded-xl bg-white p-6 shadow-soft"
                    >
                      <span className="gradient-gold mb-3 inline-block rounded-full px-4 py-2 font-[family-name:var(--font-playfair)] text-sm font-bold tracking-wide text-white">
                        {item.year}
                      </span>
                      <h4 className="mb-2 font-[family-name:var(--font-playfair)] text-lg font-bold text-coffee-900">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-coffee-600">
                        {item.description}
                      </p>
                    </motion.div>
                    {/* Mobile dot */}
                    <div className="absolute left-[17px] top-6 h-4 w-4 rounded-full border-[3px] border-gold-500 bg-cream" />
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden w-full md:block">
                    <div
                      className={`flex ${
                        i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      } items-start`}
                    >
                      {/* Spacer for alternating sides */}
                      <div className="w-[calc(50%-16px)]" />

                      {/* Desktop dot */}
                      <div className="relative z-10 flex h-4 w-4 flex-shrink-0 items-center justify-center">
                        <div className="h-4 w-4 rounded-full border-[3px] border-gold-500 bg-cream" />
                      </div>

                      {/* Content */}
                      <div className="w-[calc(50%-16px)]">
                        <motion.div
                          initial={{
                            opacity: 0,
                            x: i % 2 === 0 ? -50 : 50,
                          }}
                          animate={
                            timelineInView
                              ? { opacity: 1, x: 0 }
                              : {}
                          }
                          transition={{
                            duration: 0.6,
                            delay: i * 0.1,
                            ease: 'easeOut',
                          }}
                          className="max-w-md rounded-xl bg-white p-6 shadow-soft"
                        >
                          <span className="gradient-gold mb-3 inline-block rounded-full px-4 py-2 font-[family-name:var(--font-playfair)] text-sm font-bold tracking-wide text-white">
                            {item.year}
                          </span>
                          <h4 className="mb-2 font-[family-name:var(--font-playfair)] text-xl font-bold text-coffee-900">
                            {item.title}
                          </h4>
                          <p className="text-sm leading-relaxed text-coffee-600">
                            {item.description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ 4. Values Section ═══════════ */}
      <div ref={valuesRef} className="bg-cream py-20">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              What Drives Us
            </span>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-coffee-900 md:text-3xl">
              Our Values
            </h3>
            <div className="mx-auto mt-4 h-[2px] w-16 gradient-gold" />
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => {
              const Icon = v.icon
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="group rounded-2xl border border-white/40 bg-white/60 p-8 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-float"
                >
                  <div className="gradient-gold mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-soft">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="mb-3 font-[family-name:var(--font-playfair)] text-xl font-bold text-coffee-900">
                    {v.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-coffee-600">
                    {v.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════════ 5. Coffee Process Section ═══════════ */}
      <div ref={processRef} className="relative overflow-hidden py-20">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/cafe/story-2.png"
            alt="Barista at work"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-espresso/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-gold-400">
              The Craft
            </span>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-white md:text-3xl">
              Our Process
            </h3>
            <div className="mx-auto mt-4 h-[2px] w-16 gradient-gold" />
          </motion.div>

          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center md:gap-8">
            {processSteps.map((step, i) => (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 30 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.2 }}
                className="relative flex flex-col items-center"
              >
                <div className="glass-dark w-64 rounded-2xl p-6 text-center shadow-premium">
                  <span className="gradient-gold mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white">
                    {i + 1}
                  </span>
                  <h4 className="mb-2 font-[family-name:var(--font-playfair)] text-xl font-bold text-gold-400">
                    {step.label}
                  </h4>
                  <p className="text-sm leading-relaxed text-white/80">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between steps (not on last) */}
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block">
                    <ArrowRight className="absolute -right-8 top-1/2 h-5 w-5 -translate-y-1/2 text-gold-400/60" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ 6. Awards Bar ═══════════ */}
      <div ref={awardsRef} className="bg-cream py-16">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-gold-500">
              Recognition
            </span>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-coffee-900 md:text-3xl">
              Awards & Accolades
            </h3>
            <div className="mx-auto mt-4 h-[2px] w-16 gradient-gold" />
          </motion.div>

          <div className="flex gap-6 overflow-x-auto pb-4 scroll-smooth-custom">
            {awards.map((award, i) => {
              const Icon = award.icon
              return (
                <motion.div
                  key={award.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={awardsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="flex min-w-[180px] flex-shrink-0 flex-col items-center gap-3"
                >
                  <div className="gradient-gold flex h-24 w-24 items-center justify-center rounded-full shadow-premium animate-pulse-glow">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-center text-sm font-semibold text-coffee-700">
                    {award.title}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ═══════════ 7. Founder Quote ═══════════ */}
      <div ref={quoteRef} className="gradient-coffee py-20">
        <div className="mx-auto max-w-4xl px-4">
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative text-center"
          >
            {/* Decorative quote mark */}
            <Quote className="mx-auto mb-6 h-12 w-12 text-gold-400/60" />

            <p className="font-[family-name:var(--font-playfair)] text-2xl font-medium leading-relaxed italic text-gold-400 md:text-3xl lg:text-4xl">
              &ldquo;Coffee is more than a drink — it&rsquo;s a ritual, an art,
              and a way to bring people together. Every cup we serve carries
              our heart and soul.&rdquo;
            </p>

            <div className="mx-auto mt-8 h-[2px] w-16 bg-gold-400/40" />

            <footer className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
                Isabella Chen
              </p>
              <p className="mt-1 text-xs text-white/50">
                Founder &amp; Head Roaster
              </p>
            </footer>
          </motion.blockquote>
        </div>
      </div>
    </section>
  )
}