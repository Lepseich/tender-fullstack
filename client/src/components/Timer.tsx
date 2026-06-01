import { useState, useEffect } from 'react'


interface TimeProps {
    deadline: string,
    status: string,
}

const Timer = ({ deadline, status }: TimeProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const deadlineTime = new Date(deadline).getTime();
            const diff = deadlineTime - now;
            setTimeLeft(diff);
        }, 1000)
        return () => clearInterval(interval);
    }, [deadline])
    const hours = Math.floor( timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor( (timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / (1000)) % 60)

    if (timeLeft <= 0 || status === 'closed') {
        return <span className="text-red-500 font-bold uppercase text-xs">Тендер завершено</span>;
    }

    return (
        <div className="text-slate-400 font-mono text-sm">
            {hours}г {minutes}хв {seconds}с
        </div>
    )
}
export default Timer