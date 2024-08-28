import Link from 'next/link';
import HeaderLinks from './HeaderLinks';

export default function Header() {
  return (
    <header className="bg-blue-500 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          RestaurAnt
        </Link>
        <HeaderLinks />
      </nav>
    </header>
  );
}