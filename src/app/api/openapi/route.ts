import { generateOpenApiDocs } from "@/lib/swagger";
import { NextResponse } from "next/server";

import "@/features/auth/auth.openapi";
import "@/features/staff/staff.openapi";

export async function GET() {
    const spec = generateOpenApiDocs();
    return NextResponse.json(spec);
}
