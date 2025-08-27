


const host = process.env.NEXT_PUBLIC_HOSTNAME || 'Hem';

export const links = [
    { title: 'Kontakt', href: '/contact' },
    { title: host ? `Om ${host}` : 'Om', href: '/about' },
    { title: 'Integritetspolicy', href: '/privacy' },
    { title: 'Sociala medier', href: '#footer' },
    { title: 'Arkiv', href: '/archive' },
];
