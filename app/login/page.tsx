"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Fetch the session to get user role after successful login
      const sessionResponse = await fetch("/api/auth/session");
      const session = await sessionResponse.json();

      if (!session?.user?.role) {
        throw new Error("Unable to determine user role");
      }

      // Redirect based on the role from session
      router.push(
        session.user.role === "PHARMACY" ? "/site/pharmacy" : "/site/patient"
      );
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a2351] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-[#0a2351] mb-8">
          Welcome to Medi-Link
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#0a2351]"
            >
              Enter email to login
            </label>
            <Input
              id="email"
              type="email"
              placeholder="ABC@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#0a2351]"
            >
              Enter Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0a2351] hover:bg-[#0a2351]/90 text-white py-3 rounded-md font-medium"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#0a2351]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-blue-600 hover:underline"
            >
              SignUp
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 flex justify-center space-x-4">
          <Link href="/login" className="hover:underline">
            Privacy Policy
          </Link>
          <span>|</span>
          <Link href="/login" className="hover:underline">
            Terms and Conditions
          </Link>
        </div>
      </div>
    </div>
  );
}
