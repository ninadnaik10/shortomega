import { redirect } from "next/navigation";
import { getURL } from "@/lib/api";

interface HashPageProps {
  params: {
    hash: string;
  };
}

export default async function HashRedirect({ params }: HashPageProps) {
  const { hash } = await params;
  const url = await getURL(hash);
  console.log(url);

  if (!url) {
    // Handle case where URL is not found
    return <h1>The requested URL is invalid.</h1>; // Make sure you have a 404 page
  }

  // Validate URL before redirecting
  const validUrl = new URL(url);
  console.log(validUrl);

  if (!validUrl.protocol.startsWith("http")) {
    throw new Error("Invalid URL protocol");
  }

  redirect(url);
}
