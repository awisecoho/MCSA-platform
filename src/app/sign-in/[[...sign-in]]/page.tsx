import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#07061f] rounded-xl mb-4">
            <svg className="w-7 h-7 text-[#f59e0b]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#07061f]">MCSA Member Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to access your training and resources</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              card: 'shadow-lg border border-gray-200',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
            }
          }}
          redirectUrl="/dashboard"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  )
}
