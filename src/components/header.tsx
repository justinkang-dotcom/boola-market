import Link from "next/link";
import { logout } from "@/actions";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, Leaf } from "./ui";

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="h-1 bg-yale" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3">
        <Link href="/" className="order-1 flex items-center gap-1.5">
          <Leaf />
          <span className="font-serif text-[1.9rem] italic leading-none tracking-tight text-yale">elm</span>
        </Link>
        <form action="/" className="order-3 w-full md:order-2 md:w-auto md:flex-1">
          <label className="sr-only" htmlFor="header-search">
            Search listings
          </label>
          <input
            id="header-search"
            name="q"
            placeholder="Search The Game, YSO, textbooks, dorm stuff"
            className="rounded-full bg-white px-4"
          />
        </form>
        <nav className="order-2 ml-auto flex items-center gap-2 md:order-3 md:ml-0">
          <Link href="/listings/new" className="btn-primary">
            Sell
          </Link>
          {user ? (
            <>
              <Link href="/messages" className="btn-secondary">
                Inbox
              </Link>
              <Link
                href={`/sellers/${user.id}`}
                className="inline-flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium hover:bg-white"
              >
                <Avatar name={user.name} />
                <span className="hidden sm:inline">{user.name.split(" ")[0]}</span>
              </Link>
              <form action={logout}>
                <button className="btn-secondary" type="submit">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="btn-secondary">
              Log in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
