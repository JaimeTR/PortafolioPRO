import { NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

export async function POST(request) {
  if (!validateAdminToken(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')
    const bucket = formData.get('bucket') || 'documents'

    if (!file) {
      return NextResponse.json({ error: 'No se envió ningún archivo' }, { status: 400 })
    }

    const supabase = createServiceRoleClient()

    // Generar un nombre único
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`

    // Subir el archivo
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return NextResponse.json({ 
      success: true, 
      url: publicUrlData.publicUrl 
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
