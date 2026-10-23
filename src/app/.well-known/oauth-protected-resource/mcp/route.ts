import { metadataCorsOptionsRequestHandler } from "mcp-handler";
import { protectedResourceMetadata } from "@/lib/connector/resourceMetadata";

// Where the /mcp connector's sign-in lives (see src/app/mcp/route.ts).
export const dynamic = "force-dynamic";
export const GET = protectedResourceMetadata;
export const OPTIONS = metadataCorsOptionsRequestHandler();
