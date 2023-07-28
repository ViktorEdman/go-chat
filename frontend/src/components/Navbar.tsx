import NavLink from "./NavLink"

export default function Navbar() {
  return (
    <nav className="flex gap-2">
      <NavLink pathName="/" label="Start" />
      <NavLink pathName="/hello" label="Hello" />

    </nav>
  )
}
