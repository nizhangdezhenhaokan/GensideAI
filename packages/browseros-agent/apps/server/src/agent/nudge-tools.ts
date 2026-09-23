import { type ToolSet, tool } from 'ai'
import { z } from 'zod'

// UI 控制工具只返回结构化结果，由对话界面渲染为交互卡片。
function sentinel(payload: Record<string, unknown>) {
  const text = JSON.stringify(payload)
  return {
    content: [{ type: 'text' as const, text }],
    isError: false,
  }
}

/** 预置应用已移除，仅保留与应用连接无关的定时任务建议。 */
export function buildNudgeToolSet(): ToolSet {
  return {
    suggest_schedule: tool({
      description:
        'Call this to suggest scheduling a task. Use in two cases: (1) MANDATORY after completing a task that could run on a recurring schedule (news, monitoring, reports, price tracking, data gathering). (2) Immediately when the user explicitly asks to schedule, automate, or repeat the current task - do NOT ask for clarification, infer all parameters from context. Do NOT call if the task requires real-time user interaction.',
      inputSchema: z.object({
        query: z.string().describe('The original user query to schedule'),
        suggestedName: z
          .string()
          .describe(
            'A short, descriptive name for the scheduled task (e.g. "Morning News Briefing")',
          ),
        scheduleType: z
          .enum(['daily', 'hourly'])
          .describe('How often the task should run'),
        scheduleTime: z
          .string()
          .optional()
          .describe(
            'Suggested time for daily tasks in HH:MM format (e.g. "09:00").',
          ),
      }),
      execute: async (args) =>
        sentinel({
          type: 'schedule_suggestion',
          query: args.query,
          suggestedName: args.suggestedName,
          scheduleType: args.scheduleType,
          scheduleTime: args.scheduleTime ?? '09:00',
        }),
      toModelOutput: ({ output }) => ({
        type: 'text',
        value:
          (output as { content: { text?: string }[] }).content[0]?.text ?? '',
      }),
    }),
  }
}
