import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LimaRH - Ecossistema de Gestão de Pessoas',
    short_name: 'LimaRH',
    description: 'Plataforma completa de ATS, HRIS e Gestão de Performance para regimes CLT e PJ.',
    start_url: '/ats',
    display: 'standalone',
    background_color: '#f8fafc',
    theme_color: '#059669',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
