export type NavLink = {
  label: string;
  href: string;
};

export const siteConfig = {
  name: "Chery",
  tagline: "Engineering Beyond Expectation",
  description:
    "Discover the Chery lineup — premium design, advanced technology, and performance engineered for the road ahead.",
  url: "https://www.chery.example.com",
  ogImage: "/og-image.jpg",
  locale: "en_US",
  primaryNav: [
    { label: "Home", href: "#hero" },
    { label: "Model", href: "#car-showcase" },
    { label: "Promo", href: "#special-offers" },
    { label: "Dealer", href: "#dealerships" },
  ] satisfies NavLink[],
  footerNav: {
    Explore: [
      { label: "Models", href: "#car-showcase" },
      { label: "Features", href: "#features" },
      { label: "Specifications", href: "#specifications" },
      { label: "Gallery", href: "#gallery" },
    ],
    Support: [
      { label: "Find a Dealer", href: "#cta" },
      { label: "Book a Test Drive", href: "#cta" },
      { label: "Contact Us", href: "#cta" },
    ],
    Company: [
      { label: "About Chery", href: "#" },
      { label: "Newsroom", href: "#" },
      { label: "Careers", href: "#" },
    ],
  } satisfies Record<string, NavLink[]>,
  social: [
    { label: "Instagram", href: "#" },
    { label: "Facebook", href: "#" },
    { label: "YouTube", href: "#" },
  ] satisfies NavLink[],
  legalNav: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Use", href: "#" },
  ] satisfies NavLink[],
};

export type SiteConfig = typeof siteConfig;