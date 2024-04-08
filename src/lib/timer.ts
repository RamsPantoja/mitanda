type StartTimerOptions = {
    catchRemainingTime: (remainingTime: string) => void
    onTimerEnds: () => void;
}

class Timer {
    private startDate: Date;
    private endDate: Date;
    private intervalId: number | undefined | NodeJS.Timeout;

    constructor(start: Date, end: Date) {
        this.startDate = start;
        this.endDate = end;
        this.intervalId = undefined;
    }

    startTimer({ catchRemainingTime, onTimerEnds }: StartTimerOptions): void {
        if (this.intervalId) {
            console.warn('Timer is already running.');
            return;
        }

        this.intervalId = setInterval(() => {
            const currentTime = new Date();
            if (currentTime >= this.endDate) {
                this.stopTimer();
                onTimerEnds();
                return;
            }

            const remainingTime = this.endDate.getTime() - currentTime.getTime();
            const remainingSeconds = Math.floor(remainingTime / 1000);
            const remainingMinutes = Math.floor(remainingSeconds / 60);
            const remainingHours = Math.floor(remainingMinutes / 60);
            const remainingDays = Math.floor(remainingHours / 24);


            catchRemainingTime(`${remainingDays !== 0 ? `${remainingDays} Días` : ""} ${remainingHours !== 0 ? `${remainingHours % 24} Hrs` : ""}  ${remainingMinutes ? `${remainingMinutes % 60} Mins` : ""}  ${remainingSeconds % 60} Segs`);
        }, 1000);
    }

    stopTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
            console.log('Timer stopped.');
        } else {
            console.warn('Timer is not running.');
        }
    }
}

export default Timer;
