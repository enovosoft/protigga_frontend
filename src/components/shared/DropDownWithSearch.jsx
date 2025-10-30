import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const DropDownWithSearch = ({
  items = [],
  valueKey = "id",
  displayKey = "title",
  searchKeys = ["title"],
  displayFormat,
  placeholder = "Select item...",
  selectedValue,
  onSelect,
  allOption,
  className = "",
  disabled = false,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Get selected item
  const selectedItem = items.find((item) => item[valueKey] === selectedValue);

  // Default display format
  const getDisplayText = (item) => {
    if (displayFormat) {
      return displayFormat(item);
    }
    return item[displayKey] || item.title || item.name || "Unknown";
  };

  // Filter items based on search
  const filteredItems = items.filter((item) => {
    if (!search) return true;

    const searchLower = search.toLowerCase();
    return searchKeys.some((key) => {
      const value = item[key];
      return value && value.toString().toLowerCase().includes(searchLower);
    });
  });

  const handleSelect = (value) => {
    onSelect?.(value);
    setOpen(false);
    setSearch("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
          disabled={disabled}
        >
          {selectedValue
            ? selectedItem
              ? getDisplayText(selectedItem)
              : "Invalid selection"
            : placeholder}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2">
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
        </div>
        <div className="max-h-48 overflow-y-auto">
          {allOption && (
            <div
              className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
              onClick={() => handleSelect(allOption.value)}
            >
              {allOption.label}
            </div>
          )}
          {filteredItems.length === 0 ? (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No items found
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item[valueKey]}
                className="px-2 py-1.5 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleSelect(item[valueKey])}
              >
                {getDisplayText(item)}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DropDownWithSearch;
