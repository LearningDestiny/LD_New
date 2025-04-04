'use client'
import React from 'react'
import Link from 'next/link'

export default function CancellationAndRefundPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Cancellation and Refund Policy</h1>
        <p className="mb-4 text-gray-600">Effective Date: 04/10/2024</p>
        
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <p className="mb-4">
            Learning Destiny Private Limited ("Company", "we", "us", or "our") Cancellation and Refund
            Policy outlines our policies and conditions regarding cancellations, returns, and refunds for the
            courses, services, and products ("Services") offered on our platform. By enrolling in our courses
            or purchasing our Services, you ("User", "you", "your") acknowledge and agree to this policy.
          </p>
          
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><a href="#no-cancellation" className="text-blue-600 hover:underline">No Cancellation and Refund Policy</a></li>
            <li><a href="#exceptions" className="text-blue-600 hover:underline">Exceptions to the No Refund Policy</a></li>
            <li><a href="#disputes" className="text-blue-600 hover:underline">Payment Disputes and Chargebacks</a></li>
            <li><a href="#changes" className="text-blue-600 hover:underline">Changes to the Cancellation and Refund Policy</a></li>
            <li><a href="#contact" className="text-blue-600 hover:underline">Contact Information</a></li>
          </ol>
        </div>

        <div className="space-y-8">
          <section id="no-cancellation">
            <h2 className="text-2xl font-semibold mb-4">1. No Cancellation and Refund Policy</h2>
            <h3 className="text-xl font-semibold mb-2">1.1 No Cancellation</h3>
            <p className="mb-4">
              Learning Destiny Private Limited does not permit cancellations for any of the courses, subscriptions, or services once the payment has been made and the enrollment has been confirmed. This applies to all users and all services offered by us, including but not limited to online courses, learning materials, live sessions, and any digital content.
            </p>
            <h3 className="text-xl font-semibold mb-2">1.2 No Refund</h3>
            <p className="mb-2">We do not offer refunds under any circumstances, including but not limited to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Non-attendance or partial attendance of the enrolled course.</li>
              <li>Dissatisfaction with course content or instructors.</li>
              <li>Change of personal circumstances or schedule conflicts.</li>
              <li>Delay in accessing course materials or technical issues unless caused by a fault on our part.</li>
            </ul>
            <p className="mt-4">
              By purchasing or enrolling in our Services, you expressly agree to this no-refund policy.
            </p>
          </section>

          <section id="exceptions">
            <h2 className="text-2xl font-semibold mb-4">2. Exceptions to the No Refund Policy</h2>
            <h3 className="text-xl font-semibold mb-2">2.1 Fraudulent Transactions</h3>
            <p className="mb-4">
              If you believe your account or payment has been compromised or that a fraudulent transaction has occurred, please reach out to us immediately at learingdestiny.info@gmail.com. We will investigate the matter and take appropriate action in accordance with RBI guidelines and applicable laws.
            </p>
            <h3 className="text-xl font-semibold mb-2">2.2 Course Cancellation by the Company</h3>
            <p className="mb-4">
              In the rare event that a course is canceled by Learning Destiny Private Limited due to unforeseen circumstances, technical issues, or lack of availability of instructors, you will be provided with alternative options, which may include enrollment in a similar course, a credit voucher, or a refund at our discretion.
            </p>
          </section>

          <section id="disputes">
            <h2 className="text-2xl font-semibold mb-4">3. Payment Disputes and Chargebacks</h2>
            <h3 className="text-xl font-semibold mb-2">3.1 Resolution of Payment Disputes</h3>
            <p className="mb-4">
              In case of any disputes related to payments, please contact us directly before initiating a chargeback with your bank. We are committed to resolving any issues amicably and promptly.
            </p>
            <h3 className="text-xl font-semibold mb-2">3.2 Unauthorized Transactions</h3>
            <p className="mb-4">
              If you notice any unauthorized or suspicious transactions, please notify us immediately at learningdestiny.info@gmail.com. We will conduct an internal investigation and, if necessary, coordinate with the relevant financial institutions to resolve the issue in compliance with RBI guidelines.
            </p>
          </section>

          <section id="changes">
            <h2 className="text-2xl font-semibold mb-4">4. Changes to the Cancellation and Refund Policy</h2>
            <p className="mb-4">
              We reserve the right to update or modify this policy at any time without prior notice. The updated policy will be effective immediately upon posting on our website. Users are encouraged to review this policy periodically to stay informed of any changes.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
            <p className="mb-2">If you have any questions, concerns, or require assistance regarding this Cancellation and Refund Policy, please contact us at:</p>
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