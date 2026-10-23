import { metadataCorsOptionsRequestHandler } from "mcp-handler";
import { protectedResourceMetadata } from "@/lib/connector/resourceMetadata";

// Same as ./mcp: clients that look at the root first find the connector too.
export const dynamic = "force-dynamic";
export const GET = protectedResourceMetadata;
export const OPTIONS = metadataCorsOptionsRequestHandler();
