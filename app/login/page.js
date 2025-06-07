import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/login-form'

export default async function LoginPage() {
    const supabase = await createClient();

    async function signIn(formData) {
        'use server'
        const email = formData.get('email')
        const password = formData.get('password')
        const supabase = await createClient()

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            return { error: error.message };
        }

        redirect('/dashboard')
    }

    return (
        <LoginForm signInAction={signIn} />
    )
}
