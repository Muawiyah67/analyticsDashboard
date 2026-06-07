"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, LayoutDashboard, Mail, Lock, User, Building2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$49",
    description: "For small teams",
    features: ["Up to 5 users", "Basic analytics", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$299",
    description: "For growing businesses",
    features: ["Up to 25 users", "Advanced analytics", "Priority support", "Custom reports"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$1,299",
    description: "For large organisations",
    features: ["Unlimited users", "Full analytics suite", "Dedicated support", "SSO & 2FA"],
  },
];

const steps = ["Account", "Company", "Plan"];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    company: "",
    role: "",
    agree: false,
  });

  const passwordStrength = (pw: string) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strength = passwordStrength(form.password);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-amber-500", "bg-yellow-400", "bg-emerald-500"];
  const strengthTextColors = ["", "text-red-500", "text-amber-500", "text-yellow-500", "text-emerald-500"];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Call AuthService.register(form.email, form.password, form.name)
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[420px] bg-slate-950 flex-col justify-between p-12 relative overflow-hidden shrink-0">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-blue-600/10" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-600/10" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Nexus</p>
            <p className="text-slate-400 text-xs mt-0.5">Analytics Pro</p>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white leading-tight">
              Start your journey
              <br />
              <span className="text-blue-400">with Nexus.</span>
            </h2>
            <p className="text-slate-400 mt-4 text-sm leading-relaxed">
              Join thousands of businesses making smarter, data-driven decisions every day.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "Real-time analytics dashboard",
              "Multi-user team management",
              "Automated reports and exports",
              "Enterprise-grade security & 2FA",
              "99.9% uptime SLA guarantee",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-600/30 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-slate-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="relative z-10">
          <p className="text-xs text-slate-500 mb-3">Step {step + 1} of {steps.length}</p>
          <div className="flex gap-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1 space-y-1">
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    i <= step ? "bg-blue-500" : "bg-slate-800"
                  )}
                />
                <p className={cn("text-xs", i <= step ? "text-slate-300" : "text-slate-600")}>{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">Nexus</span>
          </div>

          {/* Mobile step indicator */}
          <div className="flex lg:hidden gap-2 mb-2">
            {steps.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={cn("h-1 rounded-full", i <= step ? "bg-blue-500" : "bg-slate-200")} />
              </div>
            ))}
          </div>

          {/* Step 0 — Account */}
          {step === 0 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
                <p className="text-slate-500 text-sm mt-1">Let&apos;s start with your basic details</p>
              </div>

              {/* Social login */}
              <div className="grid grid-cols-2 gap-3">
                <Button type="button" variant="outline" className="h-10 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 text-sm font-medium">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button type="button" variant="outline" className="h-10 border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  GitHub
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-slate-50 text-slate-400">or sign up with email</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="John Doe"
                      className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-500"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-500"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-9 h-10 border-slate-200 focus-visible:ring-blue-500"
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
                  {form.password && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={cn(
                              "flex-1 h-1.5 rounded-full transition-all",
                              i <= strength ? strengthColors[strength] : "bg-slate-200"
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn("text-xs font-medium", strengthTextColors[strength])}>
                        {strengthLabels[strength]} password
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className={cn(
                        "pl-9 pr-9 h-10 border-slate-200 focus-visible:ring-blue-500",
                        form.confirmPassword && form.password !== form.confirmPassword && "border-red-300 focus-visible:ring-red-400"
                      )}
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2"
                disabled={form.password !== form.confirmPassword || strength < 2}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </Link>
              </p>
            </form>
          )}

          {/* Step 1 — Company */}
          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Company Details</h1>
                <p className="text-slate-500 text-sm mt-1">Tell us about your organisation</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Company Name</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Acme Corporation"
                      className="pl-9 h-10 border-slate-200 focus-visible:ring-blue-500"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Your Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["CEO / Founder", "CTO / Engineering", "Marketing", "Operations", "Finance", "Other"].map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForm({ ...form, role })}
                        className={cn(
                          "px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-all border",
                          form.role === role
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-slate-700 border-slate-200 hover:border-blue-300"
                        )}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-700">Company Size</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["1–10", "11–50", "51–200", "201–500", "500+"].map((size) => (
                      <button
                        key={size}
                        type="button"
                        className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:border-blue-300 transition-all"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={() => setStep(0)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2"
                  disabled={!form.company}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2 — Plan */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Choose your plan</h1>
                <p className="text-slate-500 text-sm mt-1">You can change this anytime from billing settings</p>
              </div>

              <div className="space-y-3">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={cn(
                      "w-full p-4 rounded-xl text-left border-2 transition-all duration-150 relative",
                      selectedPlan === plan.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 right-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0",
                            selectedPlan === plan.id
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300"
                          )}
                        >
                          {selectedPlan === plan.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900">{plan.name}</p>
                            <span className="text-xs text-slate-500">{plan.description}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                            {plan.features.map((f) => (
                              <span key={f} className="flex items-center gap-1 text-xs text-slate-600">
                                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-4">
                        <span className="text-lg font-bold text-slate-900">{plan.price}</span>
                        <span className="text-xs text-slate-400">/mo</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="agree"
                  checked={form.agree}
                  onCheckedChange={(checked) => setForm({ ...form, agree: !!checked })}
                />
                <Label htmlFor="agree" className="text-sm text-slate-600 font-normal cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                </Label>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium gap-2"
                  disabled={!form.agree || loading}
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
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
