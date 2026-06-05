import { useState, useEffect } from 'react'


interface TimeProps {
    deadline: string;
    status: string;
    tenderId?: string;
    onExpire?: (id: string) => void; 
}

const Timer = ({ deadline, status, tenderId, onExpire }: TimeProps) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const diff = new Date(deadline).getTime() - Date.now();
        return diff > 0 ? diff : 0;
    });

    useEffect(() => {
        if (status === 'closed' || timeLeft <= 0) return;

        const interval = setInterval(() => {
            const diff = new Date(deadline).getTime() - Date.now();
            
            if (diff <= 0) {
                setTimeLeft(0);
                if (onExpire && tenderId) onExpire(tenderId);
                clearInterval(interval);
            } else {
                setTimeLeft(diff);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [deadline, status, tenderId, onExpire]);

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    if (timeLeft <= 0 || status === 'closed') {
        return <span className="text-rose-500 font-bold uppercase text-[10px]">Завершено</span>;
    }

    return (
        <span className="font-mono font-bold text-indigo-600">
            {hours}h {minutes}m {seconds}s
        </span>
    );
};
export default Timer