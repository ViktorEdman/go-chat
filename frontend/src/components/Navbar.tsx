import { Link } from "wouter-preact"

export default function Navbar() {
  return (
    <>
      <div className="text-md">
        Hello world
      </div>
      <Link href="/hello"><a>Hello</a></Link>
    </>
  )
}
