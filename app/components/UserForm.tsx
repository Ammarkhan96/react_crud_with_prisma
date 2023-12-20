'use client'

import { User } from '@prisma/client';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

interface Props {
          id: number,
          onUserUpdate: (userData: FormData) => Promise<boolean>
}

const UserForm = ({id, onUserUpdate}: Props) => {
      const [needFetch, setNeedFetch] = useState(false);
      const fileInputRef = useRef<HTMLInputElement | null>(null)
      const {register, handleSubmit, formState: {errors}, reset} = useForm<User>();

      useEffect(() => {
          if(id === 0) {
                    reset({
                              name: '',
                              email: '',
                              age: 0,
                    })
          }
          else {
                    setNeedFetch(false)
                    fetchUser()
          }
      },[id, needFetch])

      const fetchUser = async () => {
          const userResponse = await axios.get("/api/users/" + id);
          reset({
                    name: userResponse.data?.name?? "",
                    email: userResponse.data?.email?? "",
                    age: userResponse.data?.age,
          })
      }

      const onSubmit: SubmitHandler<User> = async (data) => {
        
        const formData = new FormData()
        formData.set('id', id.toString())
        formData.set('name', data.name)
        formData.set('age', data.age.toString())
        formData.set('email', data.email)

        if(fileInputRef.current?.files?.length && fileInputRef.current?.files?.length > 0){
            formData.set('image', fileInputRef.current.files[0])
        }

          const isSuccess = await onUserUpdate(formData);
          if(isSuccess){
                    (document.getElementById('userModal') as HTMLDialogElement).close();
                    setNeedFetch(true);
                    reset();
          }
      }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
          <h3 className='font-bold text-lg' >{id === 0 ? 'Add New User' : 'Edit User'}</h3>

          <div className='mb-4 mt-2'>
                    <label className='text-sm mb-2 block' htmlFor='name'>
                              Name
                              </label>
                    <input 
                    type='text'
                    id='name'
                    {...register('name', {required: 'Name is Required'})}
                    className='input input-bordered w-full'
                    />
                    {errors.name && (
                              <p className='text-red-500 text-xs italic'>{errors.name.message}</p>
                    )}

          </div>
          
          <div className='mb-4'>
                    <label className='text-sm mb-2 block' htmlFor='name'>
                              Email
                              </label>
                    <input 
                    type='email'
                    id='email'
                    {...register('email', {required: 'Email is Required', pattern: {value: /\S+@\S+\.\S/, message: 'Invalid email address'}})}
                    
                    className='input input-bordered w-full'
                    />
                    {errors.name && (
                              <p className='text-red-500 text-xs italic'>{errors.name.message}</p>
                    )}

          </div>

          <div className='mb-4'>
                    <label className='text-sm mb-2 block' htmlFor='name'>
                              Age
                              </label>
                    <input 
                    type='number'
                    id='age'
                    {...register('age', {required: 'Age is Required', min: {value: 18, message: 'Must be at least 18'}})}
                    
                    className='input input-bordered w-full'
                    />
                    {errors.name && (
                              <p className='text-red-500 text-xs italic'>{errors.name.message}</p>
                    )}

          </div>

          <div className='mb-4'>
            <label className='text-sm mb-2 block'>
             Image
            </label>
            <input type='file' className='file-input file-input-bordered file-input-success w-full' ref={fileInputRef} />
          </div>

          <button type='submit' className='btn btn-primary'>Submit</button>
          
    </form>
  )
}

export default UserForm
