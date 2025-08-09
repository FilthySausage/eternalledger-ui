import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface NavigationProps {
  activePage?: string;
}

export const Navigation = ({ activePage }: NavigationProps) => {
  const navItems = [
    { href: "/dashboard", label: "Dashboard", id: "dashboard" },
    { href: "/birth", label: "Birth Registration", id: "birth" },
    { href: "/death", label: "Death Verification", id: "death" },
    { href: "/scan", label: "Scan", id: "scan" },
    { href: "/verify", label: "Verify", id: "verify" },
    { href: "/hospital", label: "Hospital", id: "hospital" },
    { href: "/user", label: "User", id: "user" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur border-b border-base-300">
      <nav className="navbar container mx-auto px-4">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost normal-case text-xl">
            Eternal Ledger
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="flex-none hidden lg:flex items-center gap-2">
          {navItems.slice(0, 5).map(item => (
            <Link
              key={item.id}
              href={item.href}
              className={`btn btn-ghost btn-sm ${activePage === item.id ? "btn-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Menu */}
        <div className="dropdown dropdown-end lg:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navItems.map(item => (
              <li key={item.id}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Wallet Connection */}
        <div className="ml-4">
          <ConnectButton showBalance={false} />
        </div>
      </nav>
    </header>
  );
};
