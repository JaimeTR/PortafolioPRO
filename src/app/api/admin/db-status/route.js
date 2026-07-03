import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'admin123'

function validateAdminToken(request) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')
  return token === ADMIN_TOKEN
}

let cachedSql = null
function getSQLContent() {
  if (cachedSql) return cachedSql
  try {
    const sqlPath = path.join(process.cwd(), 'supabase_schema.sql')
    if (fs.existsSync(sqlPath)) {
      cachedSql = fs.readFileSync(sqlPath, 'utf-8')
    }
  } catch {}
  return cachedSql || ''
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const wantSql = searchParams.get('sql') === '1'

    if (wantSql) {
      const sql = getSQLContent()
      return NextResponse.json({ sql })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return NextResponse.json({ success: false, connected: false, tables: [] })
    }

    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { data, error } = await supabase.rpc('get_tables').maybeSingle()

    if (error) {
      const { data: tables } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .maybeSingle()
        .catch(() => ({ data: null }))

      if (tables) {
        return NextResponse.json({ success: true, connected: true, tables: tables.map(t => t.table_name) })
      }

      return NextResponse.json({ success: true, connected: true, tables: [] })
    }

    return NextResponse.json({ success: true, connected: true, tables: data || [] })

  } catch (error) {
    return NextResponse.json({ success: false, connected: false, error: error.message, tables: [] })
  }
}

export async function POST(request) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { url: testUrl, anonKey: testAnonKey, serviceRoleKey: testServiceKey } = body

    if (!testUrl || !testAnonKey || !testServiceKey) {
      return NextResponse.json({ error: 'Faltan datos de conexión' }, { status: 400 })
    }

    const supabase = createClient(testUrl, testServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { data, error } = await supabase
      .from('_test_connection')
      .select('*')
      .limit(0)
      .maybeSingle()

    // Si la tabla no existe, probamos con otra consulta
    if (error && error.code === 'PGRST204') {
      const { error: checkErr } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
        .maybeSingle()

      return NextResponse.json({
        success: true,
        connected: true,
        tables: checkErr ? [] : ['profile'],
        message: checkErr ? 'Conectado pero sin tablas. Crea las tablas necesarias.' : 'Conectado exitosamente.'
      })
    }

    if (error) {
      return NextResponse.json({ success: false, error: error.message })
    }

    return NextResponse.json({ success: true, connected: true, tables: [] })
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message })
  }
}

export async function PUT(request) {
  try {
    if (!validateAdminToken(request)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { action } = body

    if (action !== 'create_tables') {
      return NextResponse.json({ error: 'Acción no soportada' }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return NextResponse.json({ error: 'No hay conexión a Supabase configurada' }, { status: 400 })
    }

    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const sql = getSQLContent()
    if (!sql) {
      return NextResponse.json({ error: 'No se encontró el archivo SQL' }, { status: 500 })
    }

    // Dividir el SQL en statements individuales
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    const results = []
    for (const stmt of statements) {
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_statement: stmt + ';' }).maybeSingle()

        if (error) {
          results.push({ statement: stmt.substring(0, 60) + '...', success: false, error: error.message })
        } else {
          results.push({ statement: stmt.substring(0, 60) + '...', success: true })
        }
      } catch (e) {
        results.push({ statement: stmt.substring(0, 60) + '...', success: false, error: e.message })
      }
    }

    const allSuccess = results.every(r => r.success)
    const failures = results.filter(r => !r.success)

    return NextResponse.json({
      success: allSuccess,
      message: allSuccess
        ? `Todas las tablas creadas (${results.length} statements)`
        : `${results.length - failures.length} creadas, ${failures.length} fallaron`,
      results
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
