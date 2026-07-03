'use client'
import { LocalDate } from '@/lib/local-date'

export const ShowDate = ({ date }) => {
    const isValid = Number.isFinite(new Date(date).getTime())
    const safeDate = isValid ? date : Date.now()
    return (
        <span className="text-xs text-crusta-700/90 dark:text-crusta-300">
            {new LocalDate().relativeTime(safeDate)}
        </span>
    )
}
