'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Header } from '../../components/landing-page'

const AboutUs = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-blue-400">About Learning Destiny</h1>
          
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardContent className="pt-6">
              <p className="text-lg mb-4 text-gray-300">
                Welcome to <strong className="text-blue-400">Learning Destiny</strong>—where passion meets purpose and the extraordinary becomes the norm. 🚀 We're not just another ed-tech platform; we're a launchpad for your dreams, a dynamic community for ambitious learners, and a playground for innovators. Our goal? To reshape the way students, professionals, and entrepreneurs define success.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-12">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-blue-400">Who We Are?</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-300 mb-4">
                    At Learning Destiny, we're bridging the gap between academic knowledge and real-world impact. We offer cutting-edge courses and skill-building experiences that are designed to help you ace exams, land your dream job, or launch a successful career. But that's just the beginning.
                  </p>
                  <p className="text-gray-300">
                    We're more than just a learning platform—we're your partners in success. Our approach goes beyond textbooks and theories. We create opportunities to gain hands-on experience, connect you to a network of industry experts, and help you achieve your global education ambitions.
                  </p>
                </div>
                <div className="relative w-full h-64 md:h-full">
                  <Image
                    src="/Untitled design (2).png"
                    alt="Who We Are"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-blue-400">What Sets Us Apart?</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="relative w-full h-64 md:h-full order-2 md:order-1">
                  <Image
                    src="/Untitled design (3).png"
                    alt="What Sets Us Apart"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="order-1 md:order-2">
                  <ul className="space-y-2 text-gray-300">
                    <li>💡 Tailored Learning Pathways: Explore industry-focused courses, designed to equip you with the latest skills and practical know-how.</li>
                    <li>💼 Career Growth & Opportunities: Connect with employers, secure internships, and take on freelancing projects.</li>
                    <li>🌍 Global Education Guidance: Step-by-step support for admissions, test prep, and visa applications.</li>
                    <li>🚀 Startup Success Guidance: Connect aspiring entrepreneurs with investors and mentors.</li>
                    <li>🌐 Community-Driven Learning: Join our exclusive community for job opportunities and industry insights.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-blue-400">Why Choose Learning Destiny?</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="relative w-full h-64 md:h-full">
                  <Image
                    src="/Screenshot 2024-10-10 012541.png"
                    alt="Why Choose Us"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <p className="text-gray-300 mb-4">
                    Because we understand that your career isn't just a destination—it's an adventure. And we're here to equip you with everything you need for the journey, whether it's world-class courses, mentorship, internships, or the launch of your very own startup.
                  </p>
                  <p className="text-gray-300">
                    Ready to reach your true potential? Join us and transform your dreams into reality! ✨
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-blue-400">
              Learning Destiny: Turning Dreams into Destinies.
            </h3>
          </div>
        </div>
      </div>
    </>
  )
}

export default AboutUs