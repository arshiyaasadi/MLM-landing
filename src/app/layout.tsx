import { type Metadata } from 'next'

import '@/styles/tailwind.css'
import '@/styles/fonts.css'
import { ScrollOrbitBlur } from '@/components/ScrollOrbitBlur'

export const metadata: Metadata = {
  title: {
    template: '%s - تنوین',
    default: 'تنوین - MLM؛ امتیاز نقره‌ای',
  },
  description:
    'در باشگاه مشتریان نیب‌مارکت، امتیازها فقط عدد نیستند؛ سرمایه‌اند. با فعالیت و دعوت از دوستانتان در سامانه MLM، توکن TWIN دریافت کنید؛ امتیازی که ارزش آن دقیقاً برابر با نقره است.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className="bg-gray-900 antialiased" style={{ fontFamily: 'IRANSans, sans-serif' }}>
      <body className="bg-gray-900 relative">
        <ScrollOrbitBlur />
        {children}
      </body>
    </html>
  )
}
