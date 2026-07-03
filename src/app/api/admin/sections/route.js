import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

const getSectionsPath = () => path.join(process.cwd(), 'src', 'data', 'sections.json')

export async function GET() {
  try {
    const filePath = getSectionsPath()
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ success: true, data: [] })
    }
    const data = fs.readFileSync(filePath, 'utf8')
    return NextResponse.json({ success: true, data: JSON.parse(data) })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { sections } = body

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    const filePath = getSectionsPath()
    fs.writeFileSync(filePath, JSON.stringify(sections, null, 2), 'utf8')

    return NextResponse.json({ success: true, data: sections })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
