import { Card } from "../../../components/ui/card";
import { SignUp } from '@clerk/nextjs';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex min-h-screen w-full justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-blue-800">
      <Card className="p-8 bg-gray-800 bg-opacity-70 backdrop-blur-md border--700 shadow-xl">
        <div className="mb-8 text-center flex items-center justify-center">
          <Image
            src="/ll.png" // Ensure the correct path
            alt="Learning Destiny Logo"
            width={50} // Smaller size for logo
            height={50}
            className="rounded-full mr-4" // Use rounded-full for a circular image
          />
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
        </div>
        <p className="text-blue-300 text-center mb-6">Sign in to continue your learning journey</p>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-blue-600 hover:bg-blue-700 text-black font-semibold py-2 px-4 rounded transition duration-300",
              footerActionLink: "text-blue-400 hover:text-blue-300",
              formFieldInput: 
                "bg--700 border--600 text-black placeholder--400 rounded p-2",
              formFieldLabel: "text-black-300",
              identityPreviewText: "text-black-300",
              identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
              formResendCodeLink: "text-blue-400 hover:text-blue-300",
            },
          }}
        />
      </Card>
    </div>
  );
}
