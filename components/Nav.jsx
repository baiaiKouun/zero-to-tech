"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const items = [
    { href: "/",         label: "个人主页" },
    { href: "/text-lab", label: "文字实验室" },
  ];

  return (
    <div className="hero-topline">
      <p className="brand-eyebrow">zero to tech</p>
      <nav className="inline-links hero-nav">
        {items.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={"nav-link" + (active ? " active" : "")}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
