import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'projects.json');

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, 'utf8');
    const projects = JSON.parse(fileContents);
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error reading projects:", error);
    return NextResponse.json({ error: "Failed to read projects" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newProjects = await request.json();
    
    if (!Array.isArray(newProjects)) {
      return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
    }

    await fs.writeFile(dataFilePath, JSON.stringify(newProjects, null, 2), 'utf8');
    
    return NextResponse.json({ success: true, message: "Projects updated successfully" });
  } catch (error) {
    console.error("Error saving projects:", error);
    return NextResponse.json({ error: "Failed to save projects" }, { status: 500 });
  }
}
