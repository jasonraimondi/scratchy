import React, { useEffect } from "react";

import { useAuth } from "@/app/lib/use_auth";
import { Layout } from "@/app/components/layouts/layout";

export default function Logout() {
  const { logout } = useAuth();

  useEffect(() => void logout(), []);

  return (
    <Layout title="Logout">
      <h1>Logging Out...</h1>
    </Layout>
  );
}
