import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchableSelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onSearch?: (query: string) => void;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  onSearch,
}: SearchableSelectProps) {
  const selected = options.find((o) => o.value === value);
  const selectedLabel = selected ? selected.label : placeholder;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {selectedLabel}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-2">
        <input
          className="w-full border px-2 py-1 rounded text-sm"
          placeholder="Search..."
          onChange={(e) => onSearch?.(e.target.value)}
        />

        <div className="max-h-64 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full text-left px-3 py-2 hover:bg-accent flex justify-between items-center",
                value === opt.value ? "bg-accent" : ""
              )}
            >
              {opt.label}
              {value === opt.value && <Check className="h-4 w-4" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
