import React, { useState } from "react";

import { Layout } from "@/app/components/layouts/layout";
import { UpdatePasswordForm } from "@/app/components/forms/update-password-form";
import { RevokeToken } from "@/app/components/revokeToken";
import { Button } from "@/app/components/forms/elements";

export default function Profile() {
  const [show, setShow] = useState(false);
  return (
    <Layout title="profile" isPrivate>
      <RevokeToken />
      <Button onClick={() => setShow(!show)}>Update Password</Button>
      <div>
        {show && <UpdatePasswordForm />}
      </div>
    </Layout>
  );
}
