

// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-isdb-green-50 to-slate-50">
      {children}
    </div>
  );
}