/**
 * GET /api/visual-profile/presets
 * 
 * Get all available visual profile presets and options
 */

import { NextResponse } from "next/server";
import { getAllPresets } from "@/lib/visual-profile/utils";

export async function GET() {
  try {
    const presets = getAllPresets();
    return NextResponse.json(presets);
  } catch (error) {
    console.error("[GET /api/visual-profile/presets] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch presets" },
      { status: 500 }
    );
  }
}
