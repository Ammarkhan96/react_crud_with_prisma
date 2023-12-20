import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import prisma from "@/prisma/db";
import path from "path";

export async function GET(request:NextRequest) {
   const users = await prisma.user.findMany();
   return NextResponse.json(users)
}


export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null= data.get('image')as unknown as File;
  let uploadedImageUrl = "";
  if(file){
    try{
        const uploadedFileName = `${Date.now()}_${file.name}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', uploadedFileName);

        const fileBuffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(fileBuffer));
        uploadedImageUrl = uploadedFileName
    } catch(error){
        console.log("Error:", error);
    }
  }

  const user = await prisma.user.create({
    data: {
        name: data.get('name') as string || "",
        email: data.get('email') as string || "",
        age: parseInt(data.get('age') as string || "18"),
        imageUrl: uploadedImageUrl,
        isActive: true
    }
  });

  return NextResponse.json(user, {status: 201});
}