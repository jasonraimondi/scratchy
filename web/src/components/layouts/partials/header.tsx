import React from "react";

import { Link } from "@/app/components/links/link";
import { useAuth } from "@/app/lib/use_auth";

import el from "./header.module.css";

type MenuItem = {
  name: string;
  href: string;
  dataTest: string;
};

export function Header() {
  const { isAuthenticated } = useAuth();
  const leftMenu: MenuItem[] = [{ name: "Home", href: "/", dataTest: "link--home" }];
  const rightMenu: MenuItem[] = [];

  if (isAuthenticated) {
    leftMenu.push(
      { name: "Dashboard", href: "/app/dashboard", dataTest: "link--dashboard" },
      { name: "Profile", href: "/app/profile", dataTest: "link--profile" },
    );
    rightMenu.push({ name: "Logout", href: "/logout", dataTest: "link--logout" });
  } else {
    leftMenu.push();
    rightMenu.push(
      { name: "Register", href: "/register", dataTest: "link--register" },
      { name: "Login", href: "/login", dataTest: "link--login" },
    );
  }

  return (
    <header className="container center padded">
      <nav className={el.nav}>
        <ul className={el.left}>
          {leftMenu.map(l => (
            <li key={l.name}>
              <Link href={l.href} data-test={l.dataTest}>
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
        <ul className={el.right}>
          {rightMenu.map(l => (
            <li key={l.name}>
              <Link href={l.href} data-test={l.dataTest}>
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
