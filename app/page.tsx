import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">

      <h1 className="text-5xl md:text-6xl mb-6 font-[var(--font-playfair)]">
        Oh! So Legal
      </h1>

      <p className="text-gray-300 max-w-xl mb-10 text-lg">
        A platform dedicated to providing clear, structured legal awareness
        based on real court experience.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">

        <Link href="/ask-query">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 px-6 py-3 rounded-full">
            Ask a Question
          </button>
        </Link>

        <Link href="/knowledge">
          <button className="border border-gray-500 px-6 py-3 rounded-full">
            Learn Your Rights
          </button>
        </Link>

      </div>

      <p className="text-sm text-gray-500 mt-10">
        This platform provides general legal awareness and does not constitute legal advice.
      </p>

    </div>
  );
}