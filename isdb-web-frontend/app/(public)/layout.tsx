

// app/(public)/layout.tsx
import MyNavFloating from "@/components/layout/navbar2";
import Footer from "@/components/layout/footer";
import { getMentions } from "@/lib/api/mentions";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mentions = await getMentions();

  return (
    <>
      {/* Essai : motif wavyPattern.jpg en fond de toutes les pages publiques.
          Visible uniquement derrière les sections sans couleur de fond propre. */}
      <div
        className="fixed inset-0 -z-10 pointer-events-none bg-repeat opacity-30"
        style={{ backgroundImage: "url('/motif_background6.jpg')", backgroundSize: '480px 480px' }}
      />
      <MyNavFloating mentions={mentions} />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}