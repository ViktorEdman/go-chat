import { useLocation, Link } from "wouter-preact";

export default function NavLink({
  pathName,
  label,
}: {
  pathName: string;
  label: string;
}) {
  const [location] = useLocation();
  return (
    <Link href={pathName}>
      <a className={location === pathName ? "underline" : ""}>{label}</a>
    </Link>
  );
}
