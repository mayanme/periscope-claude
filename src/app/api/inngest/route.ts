import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest";
import { researchPipelineFunction } from "@/lib/pipeline/index";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [researchPipelineFunction],
});
