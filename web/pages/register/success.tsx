import { Layout } from "@/app/components/layouts/layout";

export default function RegisterSuccess() {
  return <Layout>
    <p>Success! Go check your email!</p>
    {process.env.NODE_ENV === "development" ? <p><a href="http://localhost:8025">Mailhog Link</a></p> : undefined}
  </Layout>
}
