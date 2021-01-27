import React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

import { Link } from "@/app/components/links/link";
import { colors } from "@/styles/theme";
import { useAuth } from "@/app/lib/use_auth";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <nav
        css={css`
          display: flex;
        `}
      >
        <Link href="/">
          <NavAnchor>Home</NavAnchor>
        </Link>
        {isAuthenticated() ? (
          <>
            <Link href="/app/dashboard">
              <NavAnchor>Dashboard</NavAnchor>
            </Link>
            <Link href="/app/profile">
              <NavAnchor>Profile</NavAnchor>
            </Link>
            <Link href="/logout">
              <NavAnchor data-test="logout-link">Logout</NavAnchor>
            </Link>
          </>
        ) : (
          <>
            <Link href="/app/profile">
              <NavAnchor data-test="register-link">RESTRICTED</NavAnchor>
            </Link>
            <Link href="/register">
              <NavAnchor data-test="register-link">Register</NavAnchor>
            </Link>
            <Link href="/login">
              <NavAnchor data-test="login-link">Login</NavAnchor>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

const NavAnchor = styled.a`
  color: ${colors.gray["100"]};
  font-weight: 500;
  padding: 0.5rem 0;

  &:hover,
  &:active {
    color: ${colors.gray["400"]};
  }

  &:after {
    content: "|";
    color: ${colors.black};
    text-decoration: none;
    padding: 0 2px;
  }
  &:last-child:after {
    content: "";
    padding: 0;
  }
`;
