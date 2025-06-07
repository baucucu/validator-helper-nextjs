import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
            redirect('/error') // You might want a more user-friendly error page
        }

        redirect('/dashboard') // Redirect to dashboard after successful login
    }

    return (
        <div>
            <h1>Login</h1>
            <form action={signIn}>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required />
                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required />
                <button type="submit">Sign In</button>
            </form>
            <p>
                {/* Removed: Don't have an account? <a href="/signup">Sign Up</a> */}
            </p>
        </div>
    )
} 