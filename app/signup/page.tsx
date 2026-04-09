import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // shadcn থাকলে
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">নতুন অ্যাকাউন্ট তৈরি করুন</CardTitle>
          <CardDescription>
            আমারুট নেটওয়ার্কে যুক্ত হতে নিচের তথ্যগুলো দিন
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* ইউজার টাইপ সিলেকশন */}
            <div className="space-y-2">
              <Label>আপনি কি হিসেবে জয়েন করছেন?</Label>
              <Tabs defaultValue="individual" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="individual">ব্যক্তিগত (Individual)</TabsTrigger>
                  <TabsTrigger value="company">কর্পোরেট (Company)</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">নাম</Label>
                <Input id="firstName" placeholder="আপনার নাম" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">ফোন নম্বর</Label>
                <Input id="phone" placeholder="০১৭xxxxxxxx" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল (পার্সোনাল)</Label>
              <Input id="email" type="email" placeholder="rahim@gmail.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="pt-2">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6">
                অ্যাকাউন্ট তৈরি করুন
              </Button>
            </div>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            অলরেডি অ্যাকাউন্ট আছে?{" "}
            <Link href="/login" className="text-green-600 hover:underline font-medium">
              লগইন করুন
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}