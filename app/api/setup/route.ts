import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const results = [];

    // 1. Create 'uploads' bucket
    const { error: bucketError } = await supabase.storage.createBucket(
      "uploads",
      {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
        ],
      },
    );

    if (bucketError) {
      if (bucketError.message.includes("already exists")) {
        results.push("✅ Bucket 'uploads' already exists.");
      } else {
        results.push(`❌ Failed to create bucket: ${bucketError.message}`);
      }
    } else {
      results.push("✅ Bucket 'uploads' created successfully.");
    }

    // 2. Check/Create 'hero_content' table (via SQL is best, but we can't run raw SQL easily via JS client without RPC)
    // We will just report on the bucket status for now as that is the blocker.

    return NextResponse.json({
      success: true,
      messages: results,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
