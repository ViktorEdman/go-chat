import NavLink from "./NavLink";

export default function Navbar() {
  return (
    <nav className="flex gap-2 my-7">
      <NavLink pathName="/" label="Start" />
      <NavLink pathName="/about" label="About" />
      <NavLink pathName="/chat" label="Chat!" />
    </nav>
  );
}
