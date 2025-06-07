import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    async function signOut() {
        'use server'
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect('/login');
    }

    return (
        <div>
            <h1>Welcome to your Dashboard, {user.email}!</h1>
            <form action={signOut}>
                <button type="submit">Sign Out</button>
            </form>
            {/* Future dashboard content will go here */}
        </div>
    );
} 