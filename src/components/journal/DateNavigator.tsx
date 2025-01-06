import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  LogOut,
  User,
} from "lucide-react";
import { format } from "date-fns";

interface DateNavigatorProps {
  currentDate?: Date;
  onDateChange?: (date: Date) => void;
  onLogout?: () => void;
  userName?: string;
}

const DateNavigator = ({
  currentDate = new Date(),
  onDateChange = () => {},
  onLogout = () => console.log("Logout clicked"),
  userName = "John Doe",
}: DateNavigatorProps) => {
  const [date, setDate] = React.useState<Date>(currentDate);

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    onDateChange(newDate);
  };

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + (direction === "prev" ? -1 : 1));
    handleDateChange(newDate);
  };

  return (
    <div className="w-full h-[60px] bg-background border-b flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigateDay("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "MMMM d, yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && handleDateChange(newDate)}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" onClick={() => navigateDay("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {userName}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DateNavigator;
