import { notFound } from "next/navigation";
import ResourceArticle from "../../../components/ResourceArticle";
import { resources, getResource } from "../../../data/resources";

export function generateStaticParams() {
  return resources.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getResource(slug);
  return {
    title: post ? post.title : "Resource",
    description: post?.excerpt,
    alternates: { canonical: post ? `/resources/${post.slug}` : "/resources" },
  };
}

export default async function ResourcePage({ params }) {
  const { slug } = await params;
  const post = getResource(slug);

  if (!post) {
    notFound();
  }

  return <ResourceArticle post={post} />;
}
