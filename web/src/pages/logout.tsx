import { useAuth } from "@/app/lib/use_auth";
import React, { useEffect } from "react";

import { Layout } from "@/app/components/layouts/layout";

export default function Logout() {
  const { handleLogout } = useAuth();

  useEffect(() => {
    handleLogout();
  }, []);

  return <Layout title="Logout">
    <h1>Logging Out...</h1>
  </Layout>;
};

