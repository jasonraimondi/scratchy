import React from "react";

import { Link } from "@/app/components/links/link";
import { useAuth } from "@/app/lib/use_auth";

export function Header() {
  const { isAuthenticated } = useAuth();
  const menuLinks = [
    {
      name: "Home",
      href: "/",
      dataTest: "link--home",
    },
  ];

  if (isAuthenticated()) {
    menuLinks.push(
      {
        name: "Dashboard",
        href: "/app/dashboard",
        dataTest: "link--dashboard",
      },
      {
        name: "Profile",
        href: "/app/profile",
        dataTest: "link--profile",
      },
      {
        name: "Logout",
        href: "/logout",
        dataTest: "link--logout",
      },
    );
  } else {
    menuLinks.push(
      {
        name: "Restricted",
        href: "/app/profile",
        dataTest: "link--restricted",
      },
      {
        name: "Register",
        href: "/register",
        dataTest: "link--register",
      },
      {
        name: "Login",
        href: "/login",
        dataTest: "link--login",
      },
    );
  }

  return (
    <header>
      <nav>
        <ul>
          {menuLinks.map(l => (
            <li>
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
