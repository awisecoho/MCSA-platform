import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Municipal Claims Standards Association (MCSA)',
  description: 'The national standard for municipal property and equipment claims handling. Training, certification, and resources for adjusters, carriers, and municipalities.',
  keywords: 'municipal claims, fire apparatus claims, police vehicle claims, ambulance claims, claims adjuster training, CMCA certification',
  openGraph: {
    title: 'Municipal Claims Standards Association (MCSA)',
    description: 'Setting the standard for how municipal property and equipment claims are handled.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
