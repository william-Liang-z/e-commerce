import { LoginForm } from "./components/login-form"
// import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
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

      {/* Theme Toggle */}
      {/* <div className="absolute right-4 top-4 z-10">
        <ThemeToggle />
      </div> */}

      {/* Login Form */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </main>
  )
}
