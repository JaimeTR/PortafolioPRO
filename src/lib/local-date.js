class LocalDate {
    constructor(originDate) {
        this.originDate = originDate
    }
    TIMES_FOR_CONVERT = {
        day: 1000 * 60 * 60 * 24,
        week: 1000 * 60 * 60 * 24 * 7,
        month: 1000 * 60 * 60 * 24 * 30,
        year: 1000 * 60 * 60 * 24 * 30 * 12,
    }
    format() {
        return new Date(this.originDate).toLocaleDateString('es-co', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        })
    }

    difference(substractingDate, diffType) {
        return (new Date(this.originDate) - new Date(substractingDate)) / this.TIMES_FOR_CONVERT[diffType]
    }

    relativeTime(substractingDate) {
        const diffToToday = this.diff(substractingDate)
        // Fallback si la fecha es inválida o no finita
        if (!Number.isFinite(diffToToday)) {
            return new Intl.RelativeTimeFormat('es', { style: 'long' }).format(0, 'day')
        }
        if (diffToToday > 7 && diffToToday < 30) {
            return new Intl.RelativeTimeFormat('es', { style: 'long' }).format(
                -Math.floor(this.diff(substractingDate, 'week')),
                'week'
            )
        }
        if (diffToToday > 30 && diffToToday < 365) {
            return new Intl.RelativeTimeFormat('es', { style: 'long' }).format(
                -Math.floor(this.diff(substractingDate, 'month')),
                'month'
            )
        }
        if (diffToToday >= 365) {
            return new Intl.RelativeTimeFormat('es', { style: 'long' }).format(
                -Math.floor(this.diff(substractingDate, 'year')),
                'year'
            )
        }
        return new Intl.RelativeTimeFormat('es', { style: 'long' }).format(-Math.floor(diffToToday), 'day')
    }

    diff(date, diffType = 'day') {
        const unit = this.TIMES_FOR_CONVERT[diffType] || this.TIMES_FOR_CONVERT['day']
        const d = new Date(date)
        const time = d.getTime()
        if (!Number.isFinite(time)) {
            return 0
        }
        return (Date.now() - time) / unit
    }
}

module.exports = { LocalDate }
