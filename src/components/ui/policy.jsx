'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function PrivacyPolicy() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null // or a loading spinner
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
        <p className="mb-4 text-gray-600">Effective Date: 04/10/2024</p>
        
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <p className="mb-4">
            Learning Destiny Private Limited ("Company", "we", "us", or "our") values your trust and is
            committed to safeguarding your privacy and protecting your personal and sensitive information.
            This Privacy Policy outlines the types of information we collect from users ("you", "your",
            "student", "visitor"), how it is used, and the measures we take to keep it secure.
          </p>
          <p className="mb-4">
            This Privacy Policy complies with the Information Technology Act, 2000, the Indian Contract
            Act, 1872, and RBI Guidelines applicable to financial transactions, digital payments, and
            ed-tech operations. By accessing or using our website, services, or platforms, you agree to the
            terms of this policy.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><a href="#collection" className="text-blue-600 hover:underline">Collection of Information</a></li>
            <li><a href="#purpose" className="text-blue-600 hover:underline">Purpose of Data Collection</a></li>
            <li><a href="#consent" className="text-blue-600 hover:underline">Consent and Usage</a></li>
            <li><a href="#disclosure" className="text-blue-600 hover:underline">Disclosure of Information</a></li>
            <li><a href="#security" className="text-blue-600 hover:underline">Data Security</a></li>
            <li><a href="#retention" className="text-blue-600 hover:underline">Data Retention</a></li>
            <li><a href="#rights" className="text-blue-600 hover:underline">Your Rights</a></li>
            <li><a href="#cookies" className="text-blue-600 hover:underline">Cookies and Tracking Technologies</a></li>
            <li><a href="#transfer" className="text-blue-600 hover:underline">Cross-Border Data Transfer</a></li>
            <li><a href="#grievance" className="text-blue-600 hover:underline">Grievance Redressal Mechanism</a></li>
            <li><a href="#amendments" className="text-blue-600 hover:underline">Amendments to this Policy</a></li>
            <li><a href="#governing-law" className="text-blue-600 hover:underline">Governing Law and Jurisdiction</a></li>
            <li><a href="#contact" className="text-blue-600 hover:underline">Contact Information</a></li>
          </ol>
        </div>

        <div className="space-y-8">
          <section id="collection">
            <h2 className="text-2xl font-semibold mb-4">1. Collection of Information</h2>
            <p className="mb-2">We collect the following categories of information:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>Personal Information:</strong> Includes but is not limited to your name, email address, contact number, date of birth, address, gender, educational qualifications, etc.</li>
              <li><strong>Sensitive Personal Information:</strong> Includes financial data (such as bank account details, credit/debit card details, UPI IDs), payment history, and identification documents such as Aadhaar number, PAN, or any other government-issued ID.</li>
              <li><strong>Usage Data:</strong> Data about your activity on our website, such as the pages visited, time spent, courses or services browsed, IP address, browser type, and device information.</li>
              <li><strong>Transaction Information:</strong> Information about the payments you make, the products or services purchased, and transaction-related communications.</li>
            </ol>
          </section>

          <section id="purpose">
            <h2 className="text-2xl font-semibold mb-4">2. Purpose of Data Collection</h2>
            <p className="mb-2">We collect and process your information for the following purposes:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>Provision of Services:</strong> To provide educational content, manage enrollments, and deliver interactive learning experiences.</li>
              <li><strong>Verification and Compliance:</strong> For identity verification, KYC (Know Your Customer) checks, as mandated by RBI guidelines, and compliance with legal and regulatory requirements.</li>
              <li><strong>Payment Processing:</strong> To facilitate secure payments and manage transaction records in compliance with financial regulations.</li>
              <li><strong>Communication:</strong> To communicate with you regarding courses, promotions, customer support, and any service-related queries.</li>
              <li><strong>Marketing and Analytics:</strong> For internal analysis, marketing research, and to improve the quality of our services.</li>
              <li><strong>Legal Obligations:</strong> To meet legal and regulatory obligations as required under Indian laws and RBI guidelines.</li>
            </ol>
          </section>

          <section id="consent">
            <h2 className="text-2xl font-semibold mb-4">3. Consent and Usage</h2>
            <p className="mb-4">
              By using our services or submitting your information, you consent to our collection, use,
              processing, and sharing of your data as described in this policy. You may withdraw your consent
              at any time by contacting our Data Protection Officer at learningdestiny.manager@gmail.com, but withdrawal
              of consent may limit your access to certain features and services.
            </p>
          </section>

          <section id="disclosure">
            <h2 className="text-2xl font-semibold mb-4">4. Disclosure of Information</h2>
            <p className="mb-2">We do not share your information with third parties except under the following circumstances:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>With Your Consent:</strong> When you have given explicit permission.</li>
              <li><strong>Third-Party Service Providers:</strong> We may share your information with vendors, payment gateways, and other service providers for business purposes, such as processing transactions or managing accounts.</li>
              <li><strong>Legal Compliance:</strong> If required by law, court orders, or regulatory bodies, including RBI and other financial authorities.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of the company, your information may be transferred as part of the business assets.</li>
              <li><strong>For Security and Protection:</strong> To protect against fraud, security breaches, and data misuse.</li>
            </ol>
          </section>

          <section id="security">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to protect your data from
              unauthorized access, loss, or misuse. These include encryption, secure servers, regular security
              audits, and strict access controls.
            </p>
            <p className="mb-4">
              However, while we strive to protect your personal information, no security system is
              impenetrable, and we cannot guarantee the complete security of your data transmitted over the
              internet.
            </p>
          </section>

          <section id="retention">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p className="mb-4">
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this
              policy or as required by law. For financial data, we retain transaction records for at least five
              years as per RBI's Master Directions on Digital Payment Security and other applicable
              regulations.
            </p>
          </section>

          <section id="rights">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-2">You have the following rights regarding your data:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li><strong>Access and Update:</strong> The right to access and update your personal data.</li>
              <li><strong>Data Portability:</strong> The right to request a copy of your data in a structured, machine-readable format.</li>
              <li><strong>Deletion and Erasure:</strong> The right to request deletion of your data, subject to legal and regulatory obligations.</li>
              <li><strong>Restriction of Processing:</strong> The right to restrict the processing of your data if it is inaccurate or used unlawfully.</li>
              <li><strong>Objection:</strong> The right to object to data processing for direct marketing purposes.</li>
            </ol>
          </section>

          <section id="cookies">
            <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to analyze user behavior, track interactions,
              and improve user experiences. You can control cookie preferences through your browser
              settings. However, disabling cookies may impact your ability to use some features on our
              website.
            </p>
          </section>

          <section id="transfer">
            <h2 className="text-2xl font-semibold mb-4">9. Cross-Border Data Transfer</h2>
            <p className="mb-4">
              We do not transfer your data outside India unless it is required for business operations and is
              permitted under applicable laws. In such cases, we ensure that adequate safeguards are in
              place to protect your information.
            </p>
          </section>

          <section id="grievance">
            <h2 className="text-2xl font-semibold mb-4">10. Grievance Redressal Mechanism</h2>
            <p className="mb-2">If you have any concerns or grievances regarding our privacy practices, please contact our Data Protection Officer:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li><strong>Name:</strong> Chitresh Sharma</li>
              <li><strong>Designation:</strong> Data Protection Officer/Operations Manager</li>
              <li><strong>Email:</strong> <a href="mailto:learningdestiny.manager@gmail.com" className="text-blue-600 hover:underline">learningdestiny.manager@gmail.com</a></li>
              <li><strong>Contact Number:</strong> <a href="tel:+919059898900" className="text-blue-600 hover:underline">+91 9059898900</a></li>
            </ul>
            <p className="mt-4">
              We will respond to your queries and resolve disputes in accordance with Indian legal
              requirements.
            </p>
          </section>

          <section id="amendments">
            <h2 className="text-2xl font-semibold mb-4">11. Amendments to this Policy</h2>
            <p className="mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for
              legal compliance. The updated version will be posted on our website with the "Effective Date".
              Continued use of our services after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section id="governing-law">
            <h2 className="text-2xl font-semibold mb-4">12. Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              This Privacy Policy is governed by the laws of India, and any disputes arising out of or in
              connection with this policy shall be subject to the exclusive jurisdiction of the courts in
              Hyderabad, Telangana.
            </p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="mb-2">For questions, concerns, or clarification regarding this Privacy Policy, please contact us at:</p>
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