import { notFound, redirect } from "next/navigation";
import { getURL } from "@/lib/api";

interface HashPageProps {
  params: {
    hash: string;
  };
}

export default async function HashRedirect(
  // @ts-ignore
  { params }
) {
  const { hash } = await params;
  const url = await getURL(hash);
  console.log(url);

  if (!url) {
    return <h1>The requested URL is invalid.</h1>;
  }

  const validUrl = new URL(url);
  console.log(validUrl);

  if (!validUrl.protocol.startsWith("http")) {
      notFound();

  }

  redirect(url);
}
