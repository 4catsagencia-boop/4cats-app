import { NextRequest, NextResponse } from "next/server"

const users: Record<string, { name: string; passwordEnvKey: string }> = {
  luis: { name: "Luis", passwordEnvKey: "USER_LUIS_PASSWORD" },
  majo: { name: "María José", passwordEnvKey: "USER_MAJO_PASSWORD" },
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const user = users[username.toLowerCase().trim()]
  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const expectedPassword = process.env[user.passwordEnvKey]
  if (!expectedPassword) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  return NextResponse.json({ ok: true, name: user.name }, { status: 200 })
}
