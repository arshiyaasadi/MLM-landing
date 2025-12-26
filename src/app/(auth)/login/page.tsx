import { type Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { TextField } from '@/components/Fields'

export const metadata: Metadata = {
  title: 'ورود',
}

export default function Login() {
  return (
    <AuthLayout
      title="ورود به حساب"
      subtitle={
        <>
          حساب ندارید؟{' '}
          <Link href="/register" className="text-cyan-600">
            ثبت‌نام کنید
          </Link>{' '}
          برای آزمایش رایگان.
        </>
      }
    >
      <form>
        <div className="space-y-6">
          <TextField
            label="آدرس ایمیل"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            label="رمز عبور"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          ورود به حساب
        </Button>
      </form>
    </AuthLayout>
  )
}
