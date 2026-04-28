import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { UserProfile } from '@clerk/nextjs'

export default async function SettingsPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-[#07061f] mb-6">Account Settings</h1>
        <UserProfile
          appearance={{
            elements: {
              card: 'shadow-sm border border-gray-200',
            }
          }}
        />
      </div>
      <Footer />
    </div>
  )
}
