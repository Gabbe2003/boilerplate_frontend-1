


const host = process.env.NEXT_PUBLIC_HOSTNAME || 'Home';
  
export const links = [
    { title: 'Contact', href: '/contact' },
    { title: host ? `About ${host}` : 'About', href: '/about' },
    { title: 'Privacy policy', href: '/privacy' },
    { title: 'Social Media', href: '#footer' },
    { title: 'Archive', href: '/archive' },
];
