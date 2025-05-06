import { DefaultSeoProps } from 'next-seo';

const seoConfig: DefaultSeoProps = {
  titleTemplate: '%s | Leonard Lim - Independent UX Design Consultant',
  defaultTitle: 'Leonard Lim - Independent UX Design Consultant',
  description: 'Independent UX Design Consultant specializing in User Experience (UX) Design and Digital Product Design for early stage startups and businesses.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://byleonardlim.com',
    site_name: 'Leonard Lim - Full Stack Developer',
    images: [
      {
        url: 'https://byleonardlim.com/og-image.png',
        alt: 'Leonard Lim - Full Stack Developer',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    handle: '@byleonardlim',
    site: 'https://byleonardlim.com',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'keywords',
      content: 'ux design, ux audit, low-code development, no-code development',
    },
  ],
};

export const defaultSEOConfig = seoConfig;
