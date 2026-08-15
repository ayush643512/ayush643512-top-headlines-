import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 md:pt-36 pb-20 min-h-screen mx-auto max-w-3xl px-5 md:px-8 prose prose-invert">
        <h1 className="font-display text-3xl font-semibold mb-6">Terms &amp; Conditions</h1>
        <p className="text-white/60 leading-relaxed">
          By using Top Headlines you agree to use downloaded documents
          responsibly and in accordance with any licensing terms attached to
          them. Replace this placeholder with your organization&apos;s actual
          terms of service before launch.
        </p>
      </main>
      <Footer />
    </>
  );
}
