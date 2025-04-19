
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string;
  className?: string;
  onExpire?: () => void;
}

const CountdownTimer = ({ endDate, className, onExpire }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        onExpire && onExpire();
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);
      
      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && 
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (isExpired) {
    return <div className={`text-destructive flex items-center ${className}`}>Deal Expired</div>;
  }

  return (
    <div className={`flex items-center gap-1 font-semibold ${className}`}>
      <Clock className="h-4 w-4" />
      <div className="flex items-center">
        {timeLeft.days > 0 && (
          <div className="flex items-center">
            <span>{timeLeft.days}</span>
            <span className="text-xs text-muted-foreground ml-1 mr-2">d</span>
          </div>
        )}
        <div className="flex items-center">
          <span>{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="text-xs text-muted-foreground ml-1 mr-1">h</span>
        </div>
        <div className="flex items-center">
          <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="text-xs text-muted-foreground ml-1 mr-1">m</span>
        </div>
        <div className="flex items-center">
          <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="text-xs text-muted-foreground ml-1">s</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
