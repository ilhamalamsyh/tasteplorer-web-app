'use-client';

import ProtectedRoute from '@/routes/ProtectedRoute';
import Image from 'next/image';
import Link from 'next/link';
// import { button } from '@/components/ui/button';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {/* <header className="flex justify-end items-center p-4 border-b bg-white">
      <button className="mr-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
          />
        </svg>
        Dapatkan App
      </button>
      <button>Tulis</button>
    </header> */}

        {/* Profile Section */}
        <main className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold mb-1">Chef Jarjit edited</h1>
            <p className="text-gray-500 mb-4">@cook_111743917</p>
            <div className="flex justify-center gap-6 mb-4">
              <div className="text-center">
                <p className="font-semibold">0</p>
                <p className="text-gray-500 text-sm">Mengikuti</p>
              </div>
              <div className="text-center">
                <p className="font-semibold">0</p>
                <p className="text-gray-500 text-sm">Pengikut</p>
              </div>
            </div>
            <Link href={'/profile/edit'}>
              {' '}
              <button className="w-full max-w-md">Edit Profil</button>
            </Link>
          </div>

          {/* Empty State */}
          <div className="text-center py-12 border rounded-lg bg-white mb-8">
            <div className="w-16 h-16 mx-auto mb-4">
              <Image
                src="https://global-web-assets.cpcdn.com/assets/empty_states/no_results-8613ba06d717993e5429d9907d209dc959106472a8a4089424f1b0ccbbcd5fa9.svg"
                alt="Empty bowl"
                width={64}
                height={64}
                className="opacity-50"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Belum ada aktivitas memasak
            </h2>
            <p className="text-gray-500 mb-4">Bagikan resep atau Cooksnap</p>
            <button>Mulai</button>
          </div>

          {/* About Section */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4">Tentang Kami</h3>
            <p className="text-gray-600 mb-4">
              Misi kami di Cookpad adalah untuk membuat masak sehari-hari makin
              menyenangkan, karena kami percaya bahwa memasak adalah kunci
              menuju kehidupan yang lebih bahagia dan lebih sehat bagi manusia,
              komunitas, dan bumi. Kami mendukung koki rumahan di seluruh dunia
              untuk membantu satu sama lain dengan berbagi resep dan pengalaman
              memasak.
            </p>
            <button className="text-orange-500 p-0 h-auto">
              Langganan Premium
            </button>
            <span className="text-gray-600 ml-1">
              untuk menikmati fitur & manfaat eksklusif!
            </span>
          </div>

          {/* Footer */}
          <footer className="text-sm text-gray-600">
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Komunitas Cookpad</h4>
              <div className="flex flex-wrap gap-2">
                <span>🇬🇧 United Kingdom</span>
                <span>🇪🇸 España</span>
                <span>🇦🇷 Argentina</span>
                <span>🇺🇾 Uruguay</span>
                <span>• • •</span>
                <button className="text-sm p-0 h-auto">Lihat Semua</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="text-sm p-0 h-auto">Cookpad Premium</button>
              <button className="text-sm p-0 h-auto">Karir</button>
              <button className="text-sm p-0 h-auto">Blog</button>
              <button className="text-sm p-0 h-auto">
                Ketentuan Pemakaian
              </button>
              <button className="text-sm p-0 h-auto">Kebijakan Privasi</button>
              <button className="text-sm p-0 h-auto">FAQ</button>
            </div>
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  );
}
