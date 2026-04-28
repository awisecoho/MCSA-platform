import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#07061f',
          colorTextOnPrimaryBackground: '#ffffff',
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
