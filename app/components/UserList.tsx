'use client'

import React, { useState } from 'react'
import { User } from '@prisma/client'
import axios from 'axios';
import UserForm from './UserForm';

const UserList = () => {
          const [users, setUsers] = useState<User[]>([]);
          const [userId, setUserId] = useState(0)

          const initializeUsers = async() => {
                    const userResponse = await axios.get('./api/users');
                    setUsers(userResponse.data)
          }

          const openEditUser = (id: number) => {
            setUserId(id);
            (document.getElementById('userModal') as HTMLDialogElement).showModal();
          }

          const openNewUser = (id: number) => {
            setUserId(0);
            (document.getElementById('userModal') as HTMLDialogElement).showModal();
          }

          const openDeleteUser = (id: number) => {
            setUserId(id);
            (document.getElementById('deleteModal') as HTMLDialogElement).showModal();
          }

          const handleUserUpdate = async (userData: FormData) => {
            try{
              if(userId === 0){
                await axios.post('/api/users', userData)
              }
              else{
                await axios.patch('/api/users' + userId, userData)
              }
            } catch(error){
              console.log("Error", error);
              return false;
            }
            await initializeUsers();
            return true;
          }

          const deleteUser = async () => {
            try{
              await axios.delete('/api/users/' + userId);
              (document.getElementById('deleteModal') as HTMLDialogElement).close()
              await initializeUsers();
            } catch(error){
              console.log("Error:", error);
            }
          }

  return (
    <div>
      <div className='flex justify-between'>
         <h2>Users</h2>
         <button onClick={openNewUser} className='btn btn-primary' >Create New User</button>
      </div>

      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map(user =>
          <tr key={user.id}>
           <td>
            <div className='flex items-center gap-x-2'>
              <div className='avatar'>
                <div className='w-16 rounded-full'>
                 <img src={user.imageUrl !== null && user.imageUrl.trim() !== 
                  "" ? "/uploads/" + user.imageUrl : "/user.png"} />
                </div>
              </div>
              <div>{user.name}</div>
            </div>
           </td>
           <td>{user.age}</td>
           <td>{user.email}</td>

           <td>
            <button className='btn btn-warning' onClick={() => openEditUser(user.id)}>Edit</button>
            <button className='mx-2 btn btn-error text-white' onClick={() => openDeleteUser(user.id)}>Delete</button>
           </td>
          </tr>
          )}
        </tbody>
      </table>

      <dialog id='userModal' className='modal'>
        <div className='modal-box'>
          <form className='dialog'>
             <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
          </form>
          <UserForm id={userId} onUserUpdate={handleUserUpdate} />
        </div>
      </dialog>

      <dialog id='deleteModal' className='modal'>
        <div className='modal-box'>
          <form method='dialog'>
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>X</button>
          </form>
          <h3 className='font-bold text-lg' >Are you sure?</h3>
          <p className='py-4'>This user will be delete permanently.</p>
          <button className='btn btn-error text-white' onClick={deleteUser}>Confirm</button>
        </div>
      </dialog>

    </div>
  )
}

export default UserList
 