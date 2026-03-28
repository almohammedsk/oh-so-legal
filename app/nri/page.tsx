import Link from "next/link";

export default function NRIPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-24 text-center">

      <h1 className="text-4xl md:text-5xl mb-6 font-[var(--font-playfair)]">
        Legal Support for NRIs
      </h1>

      <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg">
        If you are residing outside India and dealing with legal issues in Hyderabad,
        our team provides structured legal clarity and guidance remotely.
      </p>

      <Link href="/ask-query">
        <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-3 rounded-full hover:scale-105 transition">
          Submit Your Query
        </button>
      </Link>

      <p className="text-sm text-gray-500 mt-6">
        Initial responses are provided for general legal awareness only.
      </p>

    </div>
  );
}