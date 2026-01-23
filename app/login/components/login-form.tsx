"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field"
import { ts } from "@/locale"
import { toast } from "sonner"
import router from "next/router"


interface LoginFormData {
  email: string
  password: string
  rememberMe: boolean
}

interface ForgotPasswordFormData {
  email: string
}

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const [loginSuccess, setLoginSuccess] = useState(false)

  // Forgot password dialog state
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Main login form
  const {
    register,
    handleSubmit,
    // setValue,
    // watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  })

  // Forgot password form
  const {
    register: registerForgot,
    handleSubmit: handleSubmitForgot,
    reset: resetForgot,
    formState: { errors: forgotErrors },
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  })

  // const rememberMe = watch("rememberMe")

  const validateEmail = (value: string) => {
    if (!value) return ts('validation.email.required')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return ts('validation.email.invalid')
    return true
  }

  const validatePassword = (value: string) => {
    if (!value) return ts('validation.password.required')
    if (value.length < 6) return ts('validation.password.minLength')
    return true
  }

  const onSubmit = async (data: LoginFormData) => {
    
    try {
      const response = await fetch('/apis/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      toast.success('登录成功！');
      router.push('/products'); // 登录后跳转到商品列表页
    } catch (error) {
      console.error(`登录失败：`, error);
    }
  }

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    setIsSendingCode(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSendingCode(false)
    setCodeSent(true)
    console.log("Send code to:", data.email)

    // Reset after 3 seconds
    setTimeout(() => {
      setCodeSent(false)
    }, 3000)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      resetForgot()
      setCodeSent(false)
    }
  }

  return (
    <div className="w-300 max-w-xl rounded-2xl bg-card p-8 shadow-lg dark:border dark:border-border">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3b82f6]">
          <Lock className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{ts('login.title')}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{ts('login.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="email">{ts('login.email')}</FieldLabel>
          <FieldContent>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={ts('login.email.placeholder')}
                {...register("email", { validate: validateEmail })}
                className={`pl-10 transition-all duration-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                aria-invalid={!!errors.email}
              />
            </div>
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </FieldContent>
        </Field>

        {/* Password Field */}
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="password">{ts('login.password')}</FieldLabel>
          <FieldContent>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={ts('login.password.placeholder')}
                {...register("password", { validate: validatePassword })}
                className={`pl-10 pr-10 transition-all duration-200 focus:border-[#3b82f6] focus:ring-[#3b82f6]/20 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? ts('aria.hidePassword') : ts('aria.showPassword')}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <FieldError errors={errors.password ? [errors.password] : undefined} />
          </FieldContent>
        </Field>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
              className="data-[state=checked]:bg-[#3b82f6] data-[state=checked]:border-[#3b82f6]"
            />
            <label
              htmlFor="remember"
              className="cursor-pointer text-sm font-normal text-muted-foreground"
            >
              {ts('login.rememberMe')}
            </label>
          </div> */}

          <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-sm text-[#3b82f6] transition-colors hover:text-[#2563eb] hover:underline"
              >
                {ts('login.forgotPassword')}
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{ts('forgotPassword.title')}</DialogTitle>
                <DialogDescription>
                  {ts('forgotPassword.description')}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmitForgot(onForgotSubmit)}>
                <div className="space-y-4 py-4">
                  <Field data-invalid={!!forgotErrors.email}>
                    <FieldLabel htmlFor="forgot-email">{ts('forgotPassword.email')}</FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder={ts('forgotPassword.email.placeholder')}
                          {...registerForgot("email", { validate: validateEmail })}
                          className={`pl-10 ${
                            forgotErrors.email
                              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                              : ""
                          }`}
                        />
                      </div>
                      <FieldError errors={forgotErrors.email ? [forgotErrors.email] : undefined} />
                    </FieldContent>
                  </Field>
                  {codeSent && (
                    <div className="rounded-lg bg-green-50 p-3 text-center text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
                      {ts('forgotPassword.sentSuccess')}
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={isSendingCode || codeSent}
                    className="w-full bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-50 sm:w-auto"
                  >
                    {isSendingCode ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {ts('forgotPassword.sending')}
                      </>
                    ) : codeSent ? (
                      ts('forgotPassword.sent')
                    ) : (
                      ts('forgotPassword.send')
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#3b82f6] text-white transition-all duration-200 hover:bg-[#2563eb] hover:shadow-md disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {ts('login.submitting')}
            </>
          ) : (
            ts('login.submit')
          )}
        </Button>

        {/* Register Link */}
        <div className="text-center text-sm text-muted-foreground">
          {ts('login.noAccount')}{" "}
          <Link
            href="/register"
            className="font-medium text-[#3b82f6] transition-colors hover:text-[#2563eb] hover:underline"
          >
            {ts('login.register')}
          </Link>
        </div>
      </form>
    </div>
  )
}
