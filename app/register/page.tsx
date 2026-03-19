"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Loader2, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field";
import { ts } from "@/locale";
import { toast } from "sonner"

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
    mode: "onChange",
  });

  const agreeTerms = useWatch({ control, name: "agreeTerms" });
  const password = useWatch({ control, name: "password" });

  const validateEmail = (value: string) => {
    if (!value) return ts("validation.email.required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return ts("validation.email.invalid");
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value) return ts("validation.password.required");
    if (value.length < 8) return ts("validation.password.minLengthRegister");
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!hasLetter || !hasNumber) return ts("validation.password.complexity");
    return true;
  };

  const validateConfirmPassword = (value: string) => {
    if (!value) return ts("validation.confirmPassword.required");
    if (value !== password) return ts("validation.confirmPassword.mismatch");
    return true;
  };

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log('register success', response)

      if(!response.ok) throw new Error('request error')

      setIsLoading(false);
      toast.success('register success')

      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (error) {
      toast.error('register error')
      console.error("Register error:", error);
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !isValid || !agreeTerms || isLoading;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-[#f8fafc] p-4 dark:bg-[#0f172a]">
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-50 dark:opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(to right, #e2e8f0 1px, transparent 1px),
            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Register Form */}
      <div className="relative z-10 w-[90%] max-w-xl rounded-2xl bg-card p-8 shadow-lg transition-all duration-300 dark:border dark:border-border md:w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6]">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{ts("register.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{ts("register.subtitle")}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">{ts("register.email")}</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={ts("register.email.placeholder")}
                  {...register("email", { validate: validateEmail })}
                  className={`pl-10 transition-all duration-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 ${
                    errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                  aria-invalid={!!errors.email}
                />
              </div>
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </FieldContent>
          </Field>

          {/* Password Field */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">{ts("register.password")}</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={ts("register.password.placeholder")}
                  {...register("password", { validate: validatePassword })}
                  className={`pl-10 pr-10 transition-all duration-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 ${
                    errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? ts("aria.hidePassword") : ts("aria.showPassword")}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError errors={errors.password ? [errors.password] : undefined} />
            </FieldContent>
          </Field>

          {/* Confirm Password Field */}
          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">{ts("register.confirmPassword")}</FieldLabel>
            <FieldContent>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={ts("register.confirmPassword.placeholder")}
                  {...register("confirmPassword", { validate: validateConfirmPassword })}
                  className={`pl-10 pr-10 transition-all duration-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 ${
                    errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showConfirmPassword ? ts("aria.hidePassword") : ts("aria.showPassword")}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <FieldError errors={errors.confirmPassword ? [errors.confirmPassword] : undefined} />
            </FieldContent>
          </Field>

          {/* Separator */}
          <Separator className="my-6" />

          {/* Agree Terms Checkbox */}
          <div className="flex items-start space-x-3">
            <Checkbox
              id="agreeTerms"
              checked={agreeTerms}
              onCheckedChange={(checked) => setValue("agreeTerms", checked === true, { shouldValidate: true })}
              className="mt-0.5 data-[state=checked]:bg-[#3b82f6] data-[state=checked]:border-[#3b82f6]"
            />
            <label htmlFor="agreeTerms" className="cursor-pointer text-sm leading-relaxed text-muted-foreground">
              {ts("register.agreeTerms.prefix")}
              <Link href="/terms" className="text-[#3b82f6] hover:underline">
                {ts("register.agreeTerms.terms")}
              </Link>
              {ts("register.agreeTerms.and")}
              <Link href="/privacy" className="text-[#3b82f6] hover:underline">
                {ts("register.agreeTerms.privacy")}
              </Link>
            </label>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            disabled={isSubmitDisabled}
            className="w-full bg-[#3b82f6] text-white transition-all duration-200 hover:bg-[#2563eb] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {ts("register.submitting")}
              </>
            ) : (
              ts("register.submit")
            )}
          </Button>

          {/* Back to Login Button */}
          <Button
            type="button"
            variant="outline"
            asChild
            className="w-full border-[#3b82f6] text-[#3b82f6] transition-all duration-200 hover:bg-[#3b82f6]/10 bg-transparent"
          >
            <Link href="/login">{ts("register.backToLogin")}</Link>
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm text-muted-foreground">
            {ts("register.hasAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb] hover:underline"
            >
              {ts("register.login")}
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
