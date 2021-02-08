import React from "react";

import { Link } from "@/app/components/links/link";
import { useAuth } from "@/app/lib/use_auth";

import style from "./header.module.css";

export function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <nav>
        <Link href="/">
          <a className={style.a}>Home</a>
        </Link>
        {isAuthenticated() ? (
          <>
            <Link href="/app/dashboard">
              <a className={style.a}>Dashboard</a>
            </Link>
            <Link href="/app/profile">
              <a className={style.a}>Profile</a>
            </Link>
            <Link href="/logout">
              <a className={style.a} data-test="logout-link">Logout</a>
            </Link>
          </>
        ) : (
          <>
            <Link href="/app/profile">
              <a className={style.a} data-test="register-link">RESTRICTED</a>
            </Link>
            <Link href="/register">
              <a className={style.a} data-test="register-link">Register</a>
            </Link>
            <Link href="/login">
              <a className={style.a} data-test="login-link">Login</a>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

