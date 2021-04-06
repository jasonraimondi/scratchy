import type { GetServerSideProps } from "next";
import React from "react";

import { Layout } from "@/app/components/layouts/layout";
import { ResetPasswordForm } from "@/app/components/forms/reset-password-form";

export default function ResetPassword({ email, token }: Record<string, string | null>) {
  if (!email || !token) {
    return (
      <Layout title="Oops Reset Password">
        <p>
          Missing Token {email} {token} 1 2 3 4
        </p>
      </Layout>
    );
  }

  return (
    <Layout title="Reset Password">
      <ResetPasswordForm email={email} token={token} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  return {
    props: {
      email: ctx.query.e ?? null,
      token: ctx.query.u ?? null,
    },
  };
};
