import { NextResponse } from "next/server";
import { getUserCountryCode } from "@/lib/getUserCountry";

export async function GET() {
  try {
    const countryCode = await getUserCountryCode();
    return NextResponse.json({ countryCode });
  } catch (error) {
    console.error("[GET_USER_COUNTRY] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
