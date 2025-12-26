import { type Metadata } from 'next'

import '@/styles/tailwind.css'
import '@/styles/fonts.css'

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
      <div className="fixed z-[5] top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-[#8B4AE8]/15 blur-[100px]" />
      <div className="fixed z-[5] bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-[#FFA500]/10 blur-[100px]" />
        {children}</body>
    </html>
  )
}
