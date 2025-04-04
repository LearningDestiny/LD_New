"use client";

import { useEffect, useState } from "react";
import { Header } from '../../components/landing-page';
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";

export default function ReferAndEarn() {
    const { isSignedIn, user } = useUser();
    const [referralCode, setReferralCode] = useState("");
    const [referralStats, setReferralStats] = useState({ totalReferrals: 0, rewardsEarned: 0 });
    const [copied, setCopied] = useState(false);
    const [redeemMessage, setRedeemMessage] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isSignedIn && user) {
            fetchReferralData();
        }
    }, [isSignedIn, user]);

    const fetchReferralData = async () => {
        if (!user) return;

        try {
            const resCode = await fetch("/api/generate-referral", {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
                headers: { "Content-Type": "application/json" },
            });
            const code = await resCode.json();
            setReferralCode(code.referralCode);

            const resStats = await fetch(`/api/referral-stats?userId=${user.id}`);
            const stats = await resStats.json();
            setReferralStats(stats);
        } catch (error) {
            console.error("Error fetching referral data:", error);
        }
    };

    const referralLink = `https://learningdestiny.in/?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRedeem = async () => {
        if (referralStats.rewardsEarned < 1000) {
            setRedeemMessage("You need at least ₹1000 to redeem.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/redeem-rewards", {
                method: "POST",
                body: JSON.stringify({ userId: user.id }),
                headers: { "Content-Type": "application/json" },
            });
            const response = await res.json();
            setRedeemMessage(response.message);
            fetchReferralData(); // Refresh referral stats after redemption
        } catch (error) {
            setRedeemMessage("Failed to redeem rewards. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-100 min-h-screen">
            <Header />

            {/* Centered Content */}
            <div className="flex flex-col items-center py-20 px-4">
                <SignedIn>
                    <Card className="w-full max-w-2xl mx-auto bg-gray-100 shadow-lg rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Refer & Earn – Share Knowledge, Get Rewarded!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-center text-gray-700">
                                Invite Friends & Earn Rewards Effortlessly
                            </p>
                            <p className="text-center text-gray-700">
                                Love learning? Now, you can earn while sharing it with friends! Refer our courses to your
                                friends, and for every successful purchase, you’ll earn exciting rewards.
                            </p>
                            {referralCode && (
                                <div className="space-y-2 text-center">
                                    <p className="font-semibold">Your Referral Link:</p>
                                    <a
                                        href={referralLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline break-all"
                                    >
                                        {referralLink}
                                    </a>
                                    <div className="flex flex-col items-center space-y-1 mt-2">
                                        <Button onClick={handleCopy} disabled={copied}>
                                            {copied ? "Copied!" : "Copy"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-center">Your Referral Stats</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="text-center py-4">
                                            <p className="text-3xl font-bold">{referralStats.totalReferrals}</p>
                                            <p className="text-sm text-gray-600">Total Referrals</p>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="text-center py-4">
                                            <p className="text-3xl font-bold">₹{referralStats.rewardsEarned}</p>
                                            <p className="text-sm text-gray-600">Rewards Earned</p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                            {referralStats.rewardsEarned >= 1000 && (
                                <div className="text-center">
                                    <Button onClick={handleRedeem} disabled={loading}>
                                        {loading ? "Processing..." : "Redeem ₹1000"}
                                    </Button>
                                    {redeemMessage && <p className="text-green-600 text-sm mt-2">{redeemMessage}</p>}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tagline Below the Card */}
                    <p className="text-green-600 font-medium text-center mt-6">
                        Start referring today and turn your network into rewards!
                    </p>

                    {/* Terms & Conditions Link Below the Tagline */}
                    <div className="text-center mt-20">
                        <Link href="/refer-earn-terms" className="text-blue-600 underline font-medium">
                            Terms & Conditions - Refer & Earn Program
                        </Link>
                    </div>
                </SignedIn>
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>
            </div>
        </div>
    );
}
