"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  date?: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void;
  disabled?: { before?: Date; after?: Date };
  fromDate?: Date;
  className?: string;
}

export function DateRangePickerValidate({
  className,
  date,
  onDateChange,
  disabled,
  fromDate,
}: DateRangePickerProps) {
  const disableMatcher = disabled
    ? // se vier both
      disabled.before != null && disabled.after != null
      ? { before: disabled.before, after: disabled.after } // DateInterval
      : disabled.before != null
        ? { before: disabled.before } // DateBefore
        : disabled.after != null
          ? { after: disabled.after } // DateAfter
          : undefined
    : undefined;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-[9999] w-auto p-0" align="start">
          <Calendar
            className="pointer-events-auto"
            initialFocus
            mode="range"
            defaultMonth={date?.from || fromDate || addDays(new Date(), 1)}
            selected={date}
            onSelect={onDateChange}
            numberOfMonths={2}
            disabled={disableMatcher}
            fromDate={fromDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
