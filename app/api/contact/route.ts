import { NextResponse } from "next/server";

type ContactBody = {
  name: string;
  email: string;
  message: string;
  sector: string;
  locale?: string;
};

function validate(body: ContactBody) {
  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = "required";
  if (!body.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.email = "invalid";
  }
  if (!body.message?.trim()) errors.message = "required";
  if (!body.sector?.trim()) errors.sector = "required";
  return errors;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;
    const errors = validate(body);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const payload = {
      name: body.name.trim(),
      email: body.email.trim(),
      message: body.message.trim(),
      sector: body.sector.trim(),
      locale: body.locale ?? "es",
      receivedAt: new Date().toISOString(),
    };

    // Log to console when no email service is configured
    console.log("[contact] New submission:", JSON.stringify(payload, null, 2));

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
