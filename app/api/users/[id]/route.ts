import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/db";
import path from "path";
import { writeFile } from "fs/promises";

export async function GET(request: NextRequest, {params} : {params: {id: string}}){
     const user = await prisma.user.findUnique({
          where: {id: parseInt(params.id)}
     });
     if(!user){
          return NextResponse.json({error: 'User not Found'}, {status: 404});
     }
     return NextResponse.json(user)
}


export async function DELETE(request: NextRequest, {params} : {params: {id: string}}){
          const user = await prisma.user.findUnique({
               where: {id: parseInt(params.id)}
          });
          if(!user){
              return NextResponse.json({error: 'User not found'}, {status: 404});
              }
              
              await prisma.user.delete({
                    where: {id: parseInt(params.id)}
              })
              
     }


     export async function PATCH(request: NextRequest, {params} : {params: {id: string}}){
          const user = await prisma.user.findUnique({
                    where: {id: parseInt(params.id)}
          });
          if(!user){
                    return NextResponse.json({error: 'User not found'}, {status: 404})
          }

          const data = await request.formData();
          const file: File | null = data.get('image')as unknown as File;
          let uploadedImageUrl= "";


          if(file){
               try{
                   const uploadedFileName = `${Date.now()}_${file.name}`
                   const filePath = path.join(process.cwd(), 'public', 'uploads', uploadedFileName)
           
                   const fileBuffer = await file.arrayBuffer();
                   await writeFile(filePath, Buffer.from(fileBuffer));
                   uploadedImageUrl = uploadedFileName
               } catch(error){
                   console.log("Error:", error)
               }
             }
           
             const updatedUser = await prisma.user.update({
               where: {id: parseInt(params.id)},
               data: {
                   name: data.get('name') as string || "",
                   email: data.get('email') as string || "",
                   age: parseInt(data.get('age') as string || "18"),
                   imageUrl: uploadedImageUrl,
               }
          });
                  
          return NextResponse.json(updatedUser)
          }
          
          