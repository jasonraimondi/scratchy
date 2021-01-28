import React from "react";

import { Link } from "@/app/components/links/link";
import { useAuth } from "@/app/lib/use_auth";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <nav
      >
        <Link href="/">
          <a>Home</a>
        </Link>
        {isAuthenticated() ? (
          <>
            <Link href="/app/dashboard">
              <a>Dashboard</a>
            </Link>
            <Link href="/app/profile">
              <a>Profile</a>
            </Link>
            <Link href="/logout">
              <a data-test="logout-link">Logout</a>
            </Link>
          </>
        ) : (
          <>
            <Link href="/app/profile">
              <a data-test="register-link">RESTRICTED</a>
            </Link>
            <Link href="/register">
              <a data-test="register-link">Register</a>
            </Link>
            <Link href="/login">
              <a data-test="login-link">Login</a>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

// const NavAnchor = styled.a`
//   color: ${colors.gray["100"]};
//   font-weight: 500;
//   padding: 0.5rem 0;

//   &:hover,
//   &:active {
//     color: ${colors.gray["400"]};
//   }

//   &:after {
//     content: "|";
//     color: ${colors.black};
//     text-decoration: none;
//     padding: 0 2px;
//   }
//   &:last-child:after {
//     content: "";
//     padding: 0;
//   }
// `;
