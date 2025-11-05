import ComplaintForm from "../../components/ComplaintForm";
import { sanityClient } from "../../sanity/lib/sanity";
import Image from "next/image";

export default async function Home() {
  const departments = await sanityClient.fetch(
    '*[_type=="department"]{_id,name}'
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 py-4 md:py-5">
          
          {/* Logo */}
          <div className="flex justify-center md:justify-start w-full md:w-auto mb-3 md:mb-0">
            <Image
              src="/logo.png"
              alt="Master Motor Logo"
              width={120}
              height={60}
              className="object-contain hidden md:block"
              priority
            />

            <Image
              src="/logoo.png"
              alt="Master Motor Logo"
              width={280}
              height={20}
              className="object-contain block md:hidden"
              priority
            />
          </div>

          {/* Company Name */}
          <div className="text-center md:text-left">
            <h1 className="hidden md:block text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-red-600 tracking-wide leading-snug">
              Master Motor Corp. Pvt. Ltd.
            </h1>
          </div>

          {/* Placeholder for balance spacing */}
          <div className="hidden md:block w-[120px]" />
        </div>
      </nav>

      {/* Main Content */}
      <section className="flex-grow flex items-center justify-center px-4 sm:px-8 py-10 md:py-16">
        {/* @ts-ignore */}
        <ComplaintForm departments={departments} />
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-xs sm:text-sm py-6 border-t border-gray-200 mt-auto bg-white">
        © {new Date().getFullYear()} Master Motor Corp. Pvt. Ltd. — All Rights Reserved
      </footer>
    </main>
  );
}
