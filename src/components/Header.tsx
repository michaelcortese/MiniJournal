import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  User,
  PenLine,
} from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function Header({ currentDate, onDateChange }: HeaderProps) {
  const { user, signOut } = useAuth();
  const userName = user?.user_metadata?.full_name || "Anonymous";
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
    <header className="border-b">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 font-semibold mr-4">
            <PenLine className="h-5 w-5" />
            MiniJournal
          </div>

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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{userName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => signOut()}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
} 