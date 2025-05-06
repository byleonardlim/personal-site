import { DefaultSeoProps } from 'next-seo';

const seoConfig: DefaultSeoProps = {
  titleTemplate: '%s | Leonard Lim - Independent UX Design Consultant',
  defaultTitle: 'Leonard Lim - Independent UX Design Consultant',
  description: 'Independent UX Design Consultant specializing in User Experience (UX) Design and Digital Product Design for early stage startups and businesses.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://byleonardlim.com',
    site_name: 'Leonard Lim - Independent UX Design Consultant',
    images: [
      {
        url: 'https://byleonardlim.com/og-image.png',
        alt: 'Leonard Lim - Independent UX Design Consultant',
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
      content: 'user experience, ux design, ux audit, app design, web-app design, low-code development, no-code development',
    },
    {
      name: 'google-site-verification',
      content: 'YOUR_GOOGLE_ANALYTICS_ID',
    },
  ],
};

export const defaultSEOConfig = seoConfig;
