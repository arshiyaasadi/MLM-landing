import { type Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { Button } from '@/components/Button'
import { SelectField, TextField } from '@/components/Fields'

export const metadata: Metadata = {
  title: 'ثبت‌نام',
}

export default function Register() {
  return (
    <AuthLayout
      title="ثبت‌نام حساب"
      subtitle={
        <>
          قبلاً ثبت‌نام کرده‌اید؟{' '}
          <Link href="/login" className="text-cyan-600">
            وارد شوید
          </Link>{' '}
          به حسابتان.
        </>
      }
    >
      <form>
        <div className="grid grid-cols-2 gap-6">
          <TextField
            label="نام"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
          <TextField
            label="نام خانوادگی"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
          <TextField
            className="col-span-full"
            label="آدرس ایمیل"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            className="col-span-full"
            label="رمز عبور"
            name="password"
            type="password"
            autoComplete="new-password"
            required
          />
          <SelectField
            className="col-span-full"
            label="چگونه از ما با خبر شدید؟"
            name="referral_source"
          >
            <option>جستجوی آلتاویستا</option>
            <option>تبلیغ سوپر بول</option>
            <option>تبلیغ اتوبوس شماره ۳۴ شهر ما</option>
            <option>پادکست &quot;هرگز استفاده نکنید&quot;</option>
          </SelectField>
        </div>
        <Button type="submit" color="cyan" className="mt-8 w-full">
          همین امروز شروع کنید
        </Button>
      </form>
    </AuthLayout>
  )
}
