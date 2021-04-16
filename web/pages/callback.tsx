import { Layout } from "@/app/components/layouts/layout";

export default function Callback() {
  // const { setAccessToken } = useAuth();
  // const router = useRouter();
  // const token = router.query.token;
  //
  // useEffect(() => {
  //   if (token && typeof token === "string") {
  //     setAccessToken(token);
  //     router.push("/app/dashboard");
  //   }
  // }, [token]);

  return (
    <Layout>
      <p>Redirecting...</p>
      {/*<p>{token}</p>*/}
    </Layout>
  );
}

// export async function getServerSideProps(context: NextPageContext) {
//   const cookies = nookies.get(context);
//   const token = cookies.jit;
//   nookies.destroy(context, "jit");
//   return {
//     props: {
//       token,
//     },
//   }
// }
