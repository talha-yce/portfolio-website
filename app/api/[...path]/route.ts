import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Path'i ayıkla
  const path = params.path || []
  
  // Eğer locale içeriyorsa (tr/api/admin/...) temizle
  const cleanPath = path.filter(segment => segment !== 'tr' && segment !== 'en')
  
  // Temizlenmiş yol ile merkezi API rotasına yönlendir
  const apiPath = `/api/${cleanPath.join('/')}`
  
  try {
    // İsteği merkezi API'ye yönlendir
    const apiResponse = await fetch(new URL(apiPath, request.url), {
      method: 'POST',
      headers: request.headers,
      body: request.body
    })
    
    // API yanıtını döndür
    const data = await apiResponse.json()
    return NextResponse.json(data, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: apiResponse.headers
    })
  } catch (error) {
    console.error(`API Proxy Error for ${apiPath}:`, error)
    return NextResponse.json(
      { success: false, message: 'API proxy error' },
      { status: 500 }
    )
  }
}

// Diğer HTTP metodları için de benzer fonksiyonlar eklenebilir
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  // Path'i ayıkla
  const path = params.path || []
  
  // Eğer locale içeriyorsa (tr/api/admin/...) temizle
  const cleanPath = path.filter(segment => segment !== 'tr' && segment !== 'en')
  
  // Temizlenmiş yol ile merkezi API rotasına yönlendir
  const apiPath = `/api/${cleanPath.join('/')}`
  
  try {
    // İsteği merkezi API'ye yönlendir
    const apiResponse = await fetch(new URL(apiPath, request.url), {
      method: 'GET',
      headers: request.headers
    })
    
    // API yanıtını döndür
    const data = await apiResponse.json()
    return NextResponse.json(data, {
      status: apiResponse.status,
      statusText: apiResponse.statusText,
      headers: apiResponse.headers
    })
  } catch (error) {
    console.error(`API Proxy Error for ${apiPath}:`, error)
    return NextResponse.json(
      { success: false, message: 'API proxy error' },
      { status: 500 }
    )
  }
} 