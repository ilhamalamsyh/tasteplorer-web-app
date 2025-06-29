import Link from 'next/link';
import React from 'react';

const MobileNavbar: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-t-md p-2 border-t flex justify-around">
      <Link href={'/'} className="flex flex-col items-center text-gray-600">
        Home<span>Title Home</span>
      </Link>
      <Link
        href={'/searchj'}
        className="flex flex-col items-center text-gray-600"
      >
        Search<span>Title Search</span>
      </Link>
      <Link
        href={'/profile'}
        className="flex flex-col items-center text-gray-600"
      >
        Profile<span>Title Profile</span>
      </Link>
    </nav>
  );
};

export default MobileNavbar;
