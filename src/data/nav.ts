// Every menu link is defined once here. The header and footer both read from
// this file, so they can't drift apart.

export type NavLink = { label: string; href: string };

export const links = {
  learn: { label: 'Learn to repair', href: '/learn-to-repair' },
  projectBikes: { label: 'Project bikes', href: '/project-bikes' },
  hours: { label: 'Hours', href: '/hours' },
  mission: { label: 'Our mission', href: '/about' },
  who: { label: 'Who we are', href: '/about#who' },
  coOps: { label: 'Other LA Co-Ops', href: '/other-la-co-ops' },
  supporters: { label: 'Supporters', href: '/supporters' },
  donate: { label: 'Donate', href: '/donate' },
  donateBikes: { label: 'Donate bikes and parts', href: '/donate#other' },
  volunteer: { label: 'Volunteer', href: '/volunteer' },
} satisfies Record<string, NavLink>;

// Header menu, in order. An entry is either a single link or a dropdown group.
export const headerMenu = [
  { label: 'Bike Repair', items: [links.learn, links.projectBikes] },
  links.hours,
  // Other LA Co-Ops is left out for now (footer only) while we decide whether
  // to keep it. To bring it back, add links.coOps between links.who and links.supporters.
  { label: 'About', items: [links.mission, links.who, links.supporters] },
  { label: 'Get Involved', items: [links.volunteer, links.donateBikes, links.donate] },
];

// Footer columns, in order.
export const footerMenu = [
  { label: 'About', items: [links.mission, links.who, links.coOps, links.supporters] },
  {
    label: 'Bike repair',
    items: [{ ...links.hours, label: 'Shop hours' }, links.learn, links.projectBikes],
  },
  { label: 'Get involved', items: [links.volunteer, links.donateBikes, links.donate] },
];
