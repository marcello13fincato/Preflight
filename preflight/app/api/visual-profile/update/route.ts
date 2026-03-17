/**
 * POST /api/visual-profile/update
 * 
 * Update the user's visual profile
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/getServerAuthSession";
import prisma from "@/lib/prisma";
import { isValidVisualProfile } from "@/lib/visual-profile/utils";
import { z } from "zod";

const UpdateVisualProfileSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  backgroundColor: z.enum(["clean", "gradient", "minimalist"]).optional(),
  visualTone: z.enum(["professional", "bold", "subtle", "energetic"]).optional(),
  typographyPreset: z.enum(["modern", "classic", "minimal", "editorial"]).optional(),
  contentStylePersonality: z.enum(["founder", "corporate", "consultant", "educator", "technical"]).optional(),
  photoStrategy: z.enum(["real_photos", "graphics", "hybrid"]).optional(),
  stylePreset: z.enum([
    "minimal_corporate",
    "bold_founder",
    "consulting_premium",
    "educational_coach",
    "tech_modern",
  ]).optional(),
  setupComplete: z.boolean().optional(),
  designNotes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateVisualProfileSchema.parse(body);

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

    // Create or update visual profile
    const updatedProfile = await prisma.visualProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        ...validatedData,
      },
      update: validatedData,
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid visual profile data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("[POST /api/visual-profile/update] Error:", error);
    return NextResponse.json(
      { error: "Failed to update visual profile" },
      { status: 500 }
    );
  }
}
