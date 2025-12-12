import { API_BASE_URL } from "@/lib/api";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, username, password, name } = body || {};

    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        username,
        password,
        name: name || username,
      }),
    });

    const data = await res.json();
    const status = res.status || 500;

    return Response.json(data, { status });
  } catch (error) {
    console.error("Registrasi via API gagal:", error);
    return Response.json(
      {
        success: false,
        message: "Gagal melakukan registrasi",
      },
      { status: 500 }
    );
  }
}

