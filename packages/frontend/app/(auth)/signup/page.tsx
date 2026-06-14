"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, LayoutDashboard, Mail, Lock, ArrowRight, Building2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/lib/api/auth.service";

const plans = [
  { id: "starter", name: "Starter", price: "$0" },
  { id: "pro", name: "Pro", price: "$29" },
  { id: "enterprise", name: "Enterprise", price: "$99" },
];

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    companySize: "",
  });

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await AuthService.register(
        form.email,
        form.password,
        form.name,
        form.company,
        form.companySize,
        selectedPlan
      );

      if (response.success) {
        window.location.href = "/";
      } else {
        alert(response.message);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-slate-950 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-blue-600/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/5" />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Nexus</p>
            <p className="text-slate-400 text-xs mt-0.5">Analytics Pro</p>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Start your journey with
              <br />
              <span className="text-blue-400">powerful insights.</span>
            </h2>
            <p className="text-slate-400 mt-4 text-base leading-relaxed max-w-sm">
              Join thousands of businesses using Nexus to track performance, manage customers, and grow revenue.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Companies", value: "10K+" },
              { label: "Data Points", value: "1M+" },
              { label: "Uptime", value: "99.9%" },
            ].map((s) => (
              <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-slate-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <p className="text-slate-300 text-sm leading-relaxed">
            &ldquo;Nexus helped us increase revenue by 40% in just 3 months. The analytics are game-changing.&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold">
              MK
            </div>
            <div>
              <p className="text-white text-sm font-medium">Mike K.</p>
              <p className="text-slate-500 text-xs">CEO, TechStart Inc</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md space-y-6">
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Nexus</span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
            <p className="text-slate-500 text-sm mt-2">Get started with your free trial</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-slate-700">
                Full Name
              </Label>
              {/* FIXED: Added bg-white text-slate-900 */}
              <Input
                id="name"
                placeholder="John Doe"
                className="h-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {/* FIXED: Added bg-white text-slate-900 */}
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  className="pl-9 h-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {/* FIXED: Added bg-white text-slate-900 */}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9 h-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company" className="text-sm font-medium text-slate-700">
                Company Name
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {/* FIXED: Added bg-white text-slate-900 */}
                <Input
                  id="company"
                  placeholder="Acme Inc"
                  className="pl-9 h-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-blue-500"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="companySize" className="text-sm font-medium text-slate-700">
                Company Size
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {/* FIXED: Added bg-white text-slate-900 */}
                <select
                  id="companySize"
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 bg-white text-sm text-slate-900 focus-visible:ring-blue-500 focus-visible:ring-2 focus-visible:outline-none"
                  value={form.companySize}
                  onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                  required
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201+">201+ employees</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Select Plan</Label>
              <div className="grid grid-cols-3 gap-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-3 rounded-lg border text-center transition-all ${
                      selectedPlan === plan.id
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    <p className="text-sm font-semibold">{plan.name}</p>
                    <p className="text-xs text-slate-500 mt-1">{plan.price}/mo</p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}