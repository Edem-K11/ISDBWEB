

// app/(public)/layout.tsx
import MyNavFloating from "@/components/layout/navbar2";
import Footer from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <MyNavFloating />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}