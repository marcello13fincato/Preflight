/**
 * GET /api/visual-profile
 * 
 * Fetch the user's visual profile
 */

import { NextRequest, NextResponse } from "next/server";
import getServerAuthSession from "@/lib/getServerAuthSession";
import prisma from "@/lib/prisma";
import { DEFAULT_VISUAL_PROFILE } from "@/lib/visual-profile/constants";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { visualProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return existing profile or defaults
    const profile = user.visualProfile || DEFAULT_VISUAL_PROFILE;

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[GET /api/visual-profile] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch visual profile" },
      { status: 500 }
    );
  }
}
