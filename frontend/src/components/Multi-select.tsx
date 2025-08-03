import { useState, useMemo } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "Selecione...",
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  // Cria uma lista deduplicada dos valores selecionados
  const uniqueSelectedValues = useMemo(() => {
    return Array.from(new Set(selectedValues));
  }, [selectedValues]);

  const toggleValue = (value: string) => {
    const newValues = uniqueSelectedValues.includes(value)
      ? uniqueSelectedValues.filter((v) => v !== value)
      : [...uniqueSelectedValues, value];
    onChange(newValues);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          <div className="flex flex-wrap gap-1">
            {uniqueSelectedValues.length > 0 ? (
              uniqueSelectedValues.map((value) => {
                const label = options.find((opt) => opt.value === value)?.label;
                return (
                  <Badge key={value} variant="secondary" className="mb-1 mr-1">
                    {label}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleValue(value);
                      }}
                    />
                  </Badge>
                );
              })
            ) : (
              <span>{placeholder}</span>
            )}
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar tags..." />
          <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-auto">
            {options.map((option, index) => (
              <CommandItem
                key={`${option.value}-${index}`}
                value={option.value}
                onSelect={() => toggleValue(option.value)}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    uniqueSelectedValues.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
