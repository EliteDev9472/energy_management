
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { DateRange } from "react-day-picker";

interface DateRangePickerProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
}

export const DateRangePicker = ({ dateRange, setDateRange }: DateRangePickerProps) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={`w-full justify-start text-left font-normal ${
              !dateRange && "text-muted-foreground"
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "d MMM yyyy", { locale: nl })} -{" "}
                  {format(dateRange.to, "d MMM yyyy", { locale: nl })}
                </>
              ) : (
                format(dateRange.from, "d MMM yyyy", { locale: nl })
              )
            ) : (
              <span>Selecteer datumbereik</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRange}
            numberOfMonths={2}
            locale={nl}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
