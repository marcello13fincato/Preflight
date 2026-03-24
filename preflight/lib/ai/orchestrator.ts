import { NextResponse } from "next/server";
import getServerAuthSession from "@/lib/getServerAuthSession";
import { buildAIContext, type AIContextOptions } from "./contextBuilder";
import { buildTaskPrompt, type TaskType } from "./taskPromptBuilder";
import { generateStructured } from "./structured";
import { formatAIResponse } from "./responseFormatter";
import { writeMemory, summarizeInput, summarizeOutput } from "./memoryWriter";
import { updateStrategicMemory } from "./strategicMemory";
import type { z } from "zod";

type OrchestrateParams<T> = {
  taskType: TaskType;
  userInput: string;
  schema: z.ZodType<T>;
  contextOptions?: AIContextOptions;
  inputRecord: Record<string, unknown>;
  extractProspect?: (output: T) => {
    linkedinUrl: string;
    name?: string;
    role?: string;
    company?: string;
    sector?: string;
    heatLevel?: string;
    priority?: string;
    summary?: string;
  } | undefined;
};

/**
 * Central orchestration function for all AI routes.
 *
 * Flow:
 * 1. Authenticate user
 * 2. Build AI context (profile, memory, prospects, activity)
 * 3. Build task-specific prompt
 * 4. Call AI provider with schema validation
 * 5. Persist memory (activity + prospect + strategic)
 * 6. Format and return structured response
 */
export async function orchestrate<T extends Record<string, unknown>>(
  params: OrchestrateParams<T>,
): Promise<NextResponse> {
  // 1. Authenticate
  const session = await getServerAuthSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Non autenticato" },
      { status: 401 },
    );
  }

  const userId = session.user.email || session.user.name || "anonymous";

  try {
    // 2. Build context
    const context = await buildAIContext(userId, params.contextOptions);

    // 3. Build prompt
    const prompt = buildTaskPrompt(params.taskType, context, params.userInput);

    // 4. Call AI
    const rawOutput = await generateStructured({
      prompt,
      schema: params.schema,
    });

    const outputRecord = rawOutput as Record<string, unknown>;

    // 5. Persist memory (fire-and-forget, don't block response)
    const memoryPromise = Promise.all([
      writeMemory({
        userId,
        taskType: params.taskType,
        inputSummary: summarizeInput(params.taskType, params.inputRecord),
        outputSummary: summarizeOutput(params.taskType, outputRecord),
        fullOutput: outputRecord,
        prospectData: params.extractProspect?.(rawOutput),
      }),
      updateStrategicMemory(userId, outputRecord, params.taskType),
    ]);

    // Don't block the response on memory writes
    memoryPromise.catch((err) => {
      console.error(`[${params.taskType}] Memory write error:`, err);
    });

    // 6. Format response
    const formatted = formatAIResponse(params.taskType, outputRecord);

    return NextResponse.json(formatted);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Errore AI sconosciuto";
    console.error(`[${params.taskType}] AI error:`, message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
