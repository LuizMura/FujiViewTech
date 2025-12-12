import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDirectory = path.join(process.cwd(), "content");

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description: string;
  image: string;
  category: string;
  author: string;
  readTime?: string;
  content: string;
  excerpt?: string;
  tags?: string[];
}

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith(".mdx") || file.endsWith(".md")) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

export function getAllPosts(): PostData[] {
  const filePaths = getAllFiles(contentDirectory);

  const posts = filePaths.map((filePath) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    // Extract slug from filename if not in frontmatter, or use the filename itself
    const fileName = path.basename(filePath);
    const slug = fileName.replace(/\.mdx?$/, "");

    return {
      slug,
      title: data.title || "",
      date: data.date || "",
      description: data.description || "",
      image: data.image || "",
      category: data.category || "Geral",
      author: data.author || "FujiViewTech",
      readTime: data.readTime || "5 min",
      content,
      excerpt: data.excerpt || "",
      tags: data.tags || [],
    };
  });

  // Sort posts by date
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getPostBySlug(slug: string): PostData | null {
  const posts = getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  return post || null;
}
