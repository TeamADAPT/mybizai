interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-hero-wash" />
      <div className="pointer-events-none absolute inset-0 grain" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
