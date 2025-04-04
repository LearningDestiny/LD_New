'use client'

import React from 'react'
import Link from 'next/link'

export default function TermsAndConditions() {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms and Conditions</h1>
        <p className="mb-4 text-gray-600">Effective Date: 04/10/2024</p>
        
        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <p className="mb-4">
            Learning Destiny Private Limited ("Company", "we", "us", or "our") Terms and Conditions
            ("Terms") govern your access to and use of our website, courses, content, and any services
            ("Services") provided by Learning Destiny Private Limited, an ed-tech company incorporated
            under the laws of India.
          </p>
          <p className="mb-4">
            By accessing, browsing, or using our website and services, you ("User", "you", "your", "student")
            agree to comply with these Terms. If you do not agree with any part of these Terms, please
            refrain from using our services.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li><a href="#acceptance" className="text-blue-600 hover:underline">Acceptance of Terms</a></li>
            <li><a href="#use" className="text-blue-600 hover:underline">Use of Services</a></li>
            <li><a href="#ip" className="text-blue-600 hover:underline">Intellectual Property Rights</a></li>
            <li><a href="#payment" className="text-blue-600 hover:underline">Payment and Refund Policy</a></li>
            <li><a href="#ugc" className="text-blue-600 hover:underline">User-Generated Content</a></li>
            <li><a href="#privacy" className="text-blue-600 hover:underline">Privacy and Data Security</a></li>
            <li><a href="#third-party" className="text-blue-600 hover:underline">Third-Party Services and Links</a></li>
            <li><a href="#disclaimers" className="text-blue-600 hover:underline">Disclaimers and Limitation of Liability</a></li>
            <li><a href="#governing-law" className="text-blue-600 hover:underline">Governing Law and Dispute Resolution</a></li>
            <li><a href="#amendments" className="text-blue-600 hover:underline">Amendments to the Terms</a></li>
            <li><a href="#contact" className="text-blue-600 hover:underline">Contact Information</a></li>
          </ol>
        </div>

        <div className="space-y-8">
          <section id="acceptance">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-2">By using our services, you acknowledge that:</p>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>You have read, understood, and accepted these Terms and our Privacy Policy.</li>
              <li>You are at least 18 years of age or have obtained the consent of a parent or legal guardian if you are a minor.</li>
              <li>You have the legal capacity to enter into a binding agreement as per the Indian Contract Act, 1872.</li>
              <li>You agree to comply with all applicable laws, including but not limited to the Information Technology Act, 2000, Consumer Protection Act, 2019, and RBI Guidelines for financial and digital payment transactions.</li>
            </ol>
          </section>

          <section id="use">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Services</h2>
            <h3 className="text-xl font-semibold mb-2">2.1 Eligibility</h3>
            <p className="mb-4">You must register for an account to access certain features of our platform. By creating an account, you represent that all information provided is accurate and current.</p>
            
            <h3 className="text-xl font-semibold mb-2">2.2 Account Security</h3>
            <p className="mb-4">You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account. Notify us immediately if you suspect any unauthorized use of your account.</p>
            
            <h3 className="text-xl font-semibold mb-2">2.3 Prohibited Activities</h3>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Use our platform for any unlawful purpose.</li>
              <li>Misrepresent your identity or provide false information.</li>
              <li>Engage in any activity that disrupts the functioning of our services.</li>
              <li>Access, collect, or store personal data of others without their consent.</li>
              <li>Distribute malware or engage in activities harmful to the platform.</li>
            </ul>
            
            <h3 className="text-xl font-semibold mb-2 mt-4">2.4 Termination</h3>
            <p>We reserve the right to suspend or terminate your access to our services if you violate these Terms, engage in fraudulent activities, or for any other reason at our discretion.</p>
          </section>

          <section id="ip">
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property Rights</h2>
            <h3 className="text-xl font-semibold mb-2">3.1 Ownership</h3>
            <p className="mb-4">All content, materials, and resources provided on our website, including but not limited to text, graphics, logos, images, and course materials ("Content"), are the intellectual property of Learning Destiny Private Limited or its licensors.</p>
            
            <h3 className="text-xl font-semibold mb-2">3.2 Limited License</h3>
            <p className="mb-4">You are granted a limited, non-transferable license to access and use the Content solely for personal, non-commercial purposes. You must not reproduce, distribute, modify, or create derivative works of the Content without our express permission.</p>
            
            <h3 className="text-xl font-semibold mb-2">3.3 Trademark Notice</h3>
            <p>All trademarks, service marks, and logos displayed on our platform are the property of Learning Destiny Private Limited. Unauthorized use is strictly prohibited.</p>
          </section>

          <section id="payment">
            <h2 className="text-2xl font-semibold mb-4">4. Payment and Refund Policy</h2>
            <h3 className="text-xl font-semibold mb-2">4.1 Payment Terms</h3>
            <p className="mb-4">Payment for courses, subscriptions, or other services must be made as per the specified pricing and terms. We use secure payment gateways in compliance with RBI guidelines to process payments.</p>
            
            <h3 className="text-xl font-semibold mb-2">4.2 Refund Policy</h3>
            <p className="mb-4">We offer refunds for services only in accordance with our Cancellation and Refund Policy, which is detailed separately. Refunds will be processed within the timeframe specified and will comply with Indian consumer protection laws.</p>
            
            <h3 className="text-xl font-semibold mb-2">4.3 GST Compliance</h3>
            <p className="mb-4">All payments are inclusive of applicable GST as per the Indian tax laws. A GST invoice will be provided for all payments.</p>
            
            <h3 className="text-xl font-semibold mb-2">4.4 Chargebacks and Disputes</h3>
            <p>You agree to contact us for any payment-related issues before initiating a chargeback or dispute with your bank. We reserve the right to suspend your account for unresolved payment disputes.</p>
          </section>

          <section id="ugc">
            <h2 className="text-2xl font-semibold mb-4">5. User-Generated Content</h2>
            <h3 className="text-xl font-semibold mb-2">5.1 Responsibility</h3>
            <p className="mb-4">If you submit or upload content, comments, feedback, or other material on our platform ("User Content"), you are solely responsible for its accuracy and legality.</p>
            
            <h3 className="text-xl font-semibold mb-2">5.2 License to Use</h3>
            <p className="mb-4">By submitting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content for the purposes of providing and promoting our services.</p>
            
            <h3 className="text-xl font-semibold mb-2">5.3 Prohibited Content</h3>
            <p>You must not upload content that is defamatory, offensive, or violates any third-party rights, including intellectual property or privacy rights. We reserve the right to remove any such content without prior notice.</p>
          </section>

          <section id="privacy">
            <h2 className="text-2xl font-semibold mb-4">6. Privacy and Data Security</h2>
            <h3 className="text-xl font-semibold mb-2">6.1 Privacy Policy</h3>
            <p className="mb-4">Our collection, use, and processing of your personal information are governed by our Privacy Policy, which is an integral part of these Terms.</p>
            
            <h3 className="text-xl font-semibold mb-2">6.2 Data Security</h3>
            <p>We implement robust security measures to protect your personal information. However, you acknowledge that no system is completely secure, and we cannot guarantee the absolute security of your data.</p>
          </section>

          <section id="third-party">
            <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services and Links</h2>
            <p className="mb-4">Our platform may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content, privacy policies, or practices of these third-party sites.</p>
            <p>You access these third-party sites at your own risk and should review their terms and policies before engaging with them.</p>
          </section>

          <section id="disclaimers">
            <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitation of Liability</h2>
            <h3 className="text-xl font-semibold mb-2">8.1 No Warranty</h3>
            <p className="mb-4">Our services are provided on an "as is" and "as available" basis. We disclaim all warranties, whether express or implied, including but not limited to the accuracy, completeness, or reliability of our content.</p>
            
            <h3 className="text-xl font-semibold mb-2">8.2 Limitation of Liability</h3>
            <p className="mb-4">To the maximum extent permitted by law, Learning Destiny Private Limited shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use or inability to use our services, even if we have been advised of the possibility of such damages.</p>
            
            <h3 className="text-xl font-semibold mb-2">8.3 Indemnity</h3>
            <p>You agree to indemnify and hold Learning Destiny Private Limited harmless from any claims, damages, or expenses arising out of your violation of these Terms or misuse of our services.</p>
          </section>

          <section id="governing-law">
            <h2 className="text-2xl font-semibold mb-4">9. Governing Law and Dispute Resolution</h2>
            <p className="mb-4">These Terms are governed by and construed in accordance with the laws of India.</p>
            <h3 className="text-xl font-semibold mb-2">9.1 Jurisdiction</h3>
            <p className="mb-4">Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Hyderabad, Telangana, India.</p>
            <h3 className="text-xl font-semibold mb-2">9.2 Dispute Resolution</h3>
            <p>Before resorting to legal proceedings, you agree to first contact us to resolve the issue amicably through negotiation or mediation.</p>
          </section>

          <section id="amendments">
            <h2 className="text-2xl font-semibold mb-4">10. Amendments to the Terms</h2>
            <p className="mb-4">We may revise these Terms from time to time to reflect changes in our services, legal requirements, or company policies. The updated Terms will be posted on our website with the "Effective Date" and will become binding upon publication. Your continued use of our services after any changes constitutes acceptance of the updated Terms.</p>
          </section>

          <section id="contact">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
            <p className="mb-2">For any questions or concerns about these Terms, please contact us at:</p>
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