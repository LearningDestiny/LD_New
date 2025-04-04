'use client'
import React from 'react'
import Link from 'next/link'

export default function shipping() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Shipping and Delivery Policy</h1>
        <p className="mb-4 text-gray-600">Effective Date: 04/10/2024</p>
        
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <p className="mb-4">
            Learning Destiny Private Limited ("Company", "we", "us", or "our") Shipping and Delivery
            Policy outlines the terms and conditions for the delivery of digital products, e-learning materials,
            and online courses ("Services") offered by Learning Destiny Private Limited, an ed-tech
            company providing digital educational resources and online training courses.
          </p>
          <p className="mb-4">
            By accessing our website and using our Services, you ("User", "you", "your") agree to the terms
            of this Shipping and Delivery Policy. Please read this policy carefully before purchasing or
            enrolling in any of our courses or services.
          </p>
          
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><a href="#scope" className="text-blue-600 hover:underline">Scope of the Policy</a></li>
            <li><a href="#delivery" className="text-blue-600 hover:underline">Delivery Mechanism</a></li>
            <li><a href="#access" className="text-blue-600 hover:underline">Access Issues and Technical Support</a></li>
            <li><a href="#no-physical" className="text-blue-600 hover:underline">No Physical Deliveries</a></li>
            <li><a href="#refund" className="text-blue-600 hover:underline">Refund and Cancellation Policy</a></li>
            <li><a href="#changes" className="text-blue-600 hover:underline">Changes to the Shipping and Delivery Policy</a></li>
            <li><a href="#governing-law" className="text-blue-600 hover:underline">Governing Law and Jurisdiction</a></li>
            <li><a href="#contact" className="text-blue-600 hover:underline">Contact Information</a></li>
          </ol>
        </div>

        <div className="space-y-8">
          <section id="scope">
            <h2 className="text-2xl font-semibold mb-4">1. Scope of the Policy</h2>
            <h3 className="text-xl font-semibold mb-2">1.1 Digital-Only Delivery</h3>
            <p className="mb-4">
              Learning Destiny Private Limited offers only digital products and services. We do not sell, ship, or deliver any physical goods or products. All course materials, resources, and content are delivered exclusively through our online platform.
            </p>
            <h3 className="text-xl font-semibold mb-2">1.2 Instant Access to E-Materials</h3>
            <p className="mb-4">
              Upon successful registration and payment for any of our courses or services, you will receive immediate access to the purchased digital content, including e-learning modules, study guides, video lectures, and other resources, through your registered account on our platform.
            </p>
          </section>

          <section id="delivery">
            <h2 className="text-2xl font-semibold mb-4">2. Delivery Mechanism</h2>
            <h3 className="text-xl font-semibold mb-2">2.1 Account Access</h3>
            <p className="mb-4">
              All digital content, including course materials, video tutorials, PDFs, and other resources, will be available for download or viewing through your personal account on our website once the payment is confirmed. You must login using your registered credentials to access the content.
            </p>
            <h3 className="text-xl font-semibold mb-2">2.2 Email Confirmation</h3>
            <p className="mb-4">
              Upon successful purchase or enrollment, you will receive a confirmation email with details of your course and instructions on how to access the content. Please ensure that you provide a valid and active email address during the registration process.
            </p>
            <h3 className="text-xl font-semibold mb-2">2.3 No Physical Shipping</h3>
            <p className="mb-4">
              We do not offer shipping or delivery of any physical products. If you are expecting physical items, please note that Learning Destiny Private Limited does not engage in the sale or distribution of tangible goods.
            </p>
          </section>

          <section id="access">
            <h2 className="text-2xl font-semibold mb-4">3. Access Issues and Technical Support</h2>
            <h3 className="text-xl font-semibold mb-2">3.1 Immediate Availability</h3>
            <p className="mb-4">
              All e-materials and digital content are designed to be accessible immediately upon successful registration and payment. If you experience any issues accessing the content or encounter technical difficulties, please reach out to our support team for assistance.
            </p>
            <h3 className="text-xl font-semibold mb-2">3.2 Technical Support</h3>
            <p className="mb-4">
              In the event of any technical problems with accessing the materials, you can contact us at:
            </p>
            <p className="mb-4">
              Email: <a href="mailto:learningdestiny.manager@gmail.com" className="text-blue-600 hover:underline">learningdestiny.manager@gmail.com</a>
            </p>
            <p className="mb-4">
              Our support team will respond promptly to resolve the issue and ensure you have uninterrupted access to your course materials.
            </p>
          </section>

          <section id="no-physical">
            <h2 className="text-2xl font-semibold mb-4">4. No Physical Deliveries</h2>
            <h3 className="text-xl font-semibold mb-2">4.1 Clarification on Non-Delivery of Physical Goods</h3>
            <p className="mb-4">
              As an e-learning platform, Learning Destiny Private Limited only provides digital educational resources. We do not ship any physical goods, products, or printed course materials. If you encounter any third-party claims or misunderstandings regarding physical shipments, please contact us immediately to address the issue.
            </p>
            <h3 className="text-xl font-semibold mb-2">4.2 Misunderstanding Regarding Physical Deliveries</h3>
            <p className="mb-4">
              If you mistakenly believe that a physical product will be delivered after purchase, please note that we only offer digital products. No physical shipments will be made under any circumstances.
            </p>
          </section>

          <section id="refund">
            <h2 className="text-2xl font-semibold mb-4">5. Refund and Cancellation Policy</h2>
            <p className="mb-4">
              As stated in our Cancellation and Refund Policy, we do not provide any cancellations or refunds for digital content once it has been made available. By purchasing our digital courses or e-materials, you acknowledge and agree that all sales are final and non-refundable.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to the Shipping and Delivery Policy</h2>
            <p className="mb-4">
              We reserve the right to update or modify this Shipping and Delivery Policy at any time without prior notice. Any changes will be effective immediately upon posting the revised policy on our website. We encourage users to review this policy periodically to stay informed about our delivery practices.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              This policy is governed by and construed in accordance with the laws of India. Any disputes arising from or in connection with this policy shall be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana, India.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p className="mb-2">For any queries, concerns, or support regarding this Shipping and Delivery Policy, please contact us at:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Email: <a href="mailto:learningdestiny.info@gmail.com" className="text-blue-600 hover:underline">learningdestiny.info@gmail.com</a></li>
              <li>Phone: <a href="tel:+919059898900" className="text-blue-600 hover:underline">+91 9059898900</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}