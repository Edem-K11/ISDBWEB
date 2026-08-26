

// app/(public)/layout.tsx
import MyNavFloating from "@/components/layout/navbar2";
import Footer from "@/components/layout/footer";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Essai : motif wavyPattern.jpg en fond de toutes les pages publiques.
          Visible uniquement derrière les sections sans couleur de fond propre. */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-repeat opacity-30"
        style={{ backgroundImage: "url('/motif_background6.jpg')", backgroundSize: '480px 480px' }}
      />
      <MyNavFloating />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}