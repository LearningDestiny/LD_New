import { SignIn } from '@clerk/nextjs'
import { Card } from "../../../components/ui/card"

import Image from 'next/image';
export default function Page() {
  return (
<div className="flex min-h-screen w-full justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800">
  <Card className="p-8 bg-gray-800 bg-opacity-50 backdrop-blur-md border-gray-700 shadow-xl flex">
    <div>
      <div className="mb-8 text-center flex items-center justify-center">
        <Image
          src="ll.png"
          alt="Learning Destiny Logo"
          width={50} // Smaller size for logo
          height={50}
          className="rounded mr-4" // Add margin to the right of the image
        />
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
      </div>
      <p className="text-blue-300 text-center">Sign in to continue your learning journey</p>
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg--600 hover:bg-blue-700 text-sm normal-case",
            footerActionLink: "text-blue-400 hover:text-blue-300",
            formFieldInput: 
              "bg--700 border--600 text-Black placeholder--400",
            formFieldLabel: "text-Black-300",
            identityPreviewText: "text-gray-300",
            identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
            formResendCodeLink: "text-blue-400 hover:text-blue-300",
          },
        }}
      />
    </div>
  </Card>
</div>
  )
}