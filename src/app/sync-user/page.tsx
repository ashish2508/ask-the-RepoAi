import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDatabaseUserId } from '@/server/auth';

const SyncUser = async () =>{
const {userId} = await auth()

if (!userId) {
  throw new Error("User not Found");
}

await getDatabaseUserId(userId);
return redirect('/dashboard')

}

export default SyncUser
