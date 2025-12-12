"use client";

import { useRouter } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import { Article } from "@/lib/types/article";

export default function NewArticlePage() {
  const router = useRouter();

  const handleSave = (article: Article) => {
    console.log("Article created:", article);
    router.push(`/admin/articles/${article.id}`);
  };

  return (
    <div>
      <ArticleEditor onSave={handleSave} />
    </div>
  );
}
