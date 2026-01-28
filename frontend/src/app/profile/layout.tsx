import { type Metadata } from 'next'
import '../(main)/globals.css'

export const metadata: Metadata = {
    title: 'Eventify',
    description: 'This is an Event Management System',
}

export default function profileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            {children}
        </div>
    )
}