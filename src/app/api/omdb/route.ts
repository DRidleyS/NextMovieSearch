import { NextResponse } from "next/server";

const BASE = process.env.OMDB_BASE_URL!;
const KEY = process.env.OMDB_API_KEY!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const s = url.searchParams.get("s");
  const i = url.searchParams.get("i");
  const page = url.searchParams.get("page") ?? "1";

  if (!s && !i) {
    return NextResponse.json(
      { Error: "Missing 's' or 'i' query" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams();
  params.set("apikey", KEY);
  params.set("page", page);

  if (s) {
    params.set("s", s);
  }
  if (i) {
    params.set("i", i);
    params.set("plot", "full");
  }

  const target = `${BASE}/?${params.toString()}`;

  try {
    const res = await fetch(target, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { Error: "Upstream fetch failed" },
      { status: 502 }
    );
  }
}
