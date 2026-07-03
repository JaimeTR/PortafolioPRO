const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://bmugasapxocnvhnmvosn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdhc2FweG9jbnZobm12b3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk1MTQzMCwiZXhwIjoyMDk4NTI3NDMwfQ.gUZj-56Jgfspzj9FRNqokH12epw8jmCzRf-Is6y_av0'
)

async function main() {
  // Add role column
  const { error: colErr } = await supabase.rpc('alter_table_add_role')
  if (colErr) {
    console.log('RPC not available, using direct SQL...')
    // Try raw SQL via REST
    const res = await fetch('https://bmugasapxocnvhnmvosn.supabase.co/rest/v1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdhc2FweG9jbnZobm12b3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk1MTQzMCwiZXhwIjoyMDk4NTI3NDMwfQ.gUZj-56Jgfspzj9FRNqokH12epw8jmCzRf-Is6y_av0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdhc2FweG9jbnZobm12b3NuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4Mjk1MTQzMCwiZXhwIjoyMDk4NTI3NDMwfQ.gUZj-56Jgfspzj9FRNqokH12epw8jmCzRf-Is6y_av0'
      },
      body: JSON.stringify({ query: 'ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT \'user\'; UPDATE users SET role = \'super_admin\', plan = \'premium\' WHERE email = \'jaimetr1309@gmail.com\';' })
    })
    console.log('Status:', res.status)
    const text = await res.text()
    console.log(text)
  }

  // Update user role
  const { error } = await supabase
    .from('users')
    .update({ role: 'super_admin', plan: 'premium' })
    .eq('email', 'jaimetr1309@gmail.com')

  if (error) {
    console.log('Update error (column may not exist yet):', error.message)
    console.log('Run this SQL in Supabase Dashboard:')
    console.log("ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';")
    console.log("UPDATE users SET role = 'super_admin', plan = 'premium' WHERE email = 'jaimetr1309@gmail.com';")
  } else {
    console.log('User updated to super_admin + premium')
  }
}

main()
