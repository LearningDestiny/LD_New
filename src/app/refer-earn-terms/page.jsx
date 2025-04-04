'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

export default function ReferEarnTerms() {
  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-3xl mx-auto bg-gray-100 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Refer & Earn - Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700">
          <p>
            These Terms & Conditions (“Terms”) govern your participation in the Refer & Earn Program (“Program”) 
            offered by Learning Destiny Pvt. Ltd. (“Company,” “we,” “us,” or “our”). By participating in this Program, 
            you agree to comply with these Terms.
          </p>
          
          <h2 className="text-xl font-semibold">1. Eligibility</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Program is open only to individuals who have successfully purchased at least one course from our platform.</li>
            <li>Only eligible users will have access to a unique referral link, enabled after a successful course purchase.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">2. Referral Process & Rewards</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>A referral is successful when the referred individual (“Referee”) makes a valid course purchase using the referrer’s link.</li>
            <li>For each successful referral, the referrer earns 1 Referral Point, equivalent to ₹100.</li>
            <li>Referral Points can be redeemed only after accumulating 10 points (₹1,000 equivalent).</li>
          </ul>
          
          <h2 className="text-xl font-semibold">3. Redemption & Usage</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Referral Points can be redeemed for cashback or discounts on future purchases.</li>
            <li>Referral Points are non-transferable, non-exchangeable, and cannot be converted to cash except as per these Terms.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">4. Prohibited Activities & Fair Usage</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Self-referrals, duplicate accounts, and fraudulent transactions will result in disqualification.</li>
            <li>The Company reserves the right to review and take action against suspicious activity.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">5. Modifications & Termination</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Company reserves the right to modify, suspend, or terminate the Program at any time.</li>
            <li>Changes will be updated on our website, and continued participation implies acceptance.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">6. Limitation of Liability</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>The Company shall not be liable for any indirect or consequential damages arising from participation in the Program.</li>
            <li>Disputes regarding rewards must be raised within 30 days of the referral transaction.</li>
          </ul>
          
          <h2 className="text-xl font-semibold">7. Governing Law & Jurisdiction</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>These Terms are governed by the laws of India.</li>
            <li>Any disputes shall be subject to the jurisdiction of the courts in Hyderabad, Telangana.</li>
          </ul>

          <p className="text-center font-medium">By participating in the Refer & Earn Program, you acknowledge that you have read, understood, and agreed to these Terms.</p>
          <p className="text-center text-gray-600 text-sm">For any queries, contact us at <a href="mailto:management@learningdestiny.in" className="text-blue-600 underline">management@learningdestiny.in</a></p>
        </CardContent>
      </Card>
    </div>
  );
}
