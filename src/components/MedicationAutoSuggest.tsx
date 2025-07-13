import React, { useState, useEffect } from "react";
import type { ChangeEvent } from "react";

interface MedicationAutoSuggestProps {
  onSelect: (medication: string) => void;
}

function MedicationAutoSuggest({ onSelect }: MedicationAutoSuggestProps) {
  const [medications, setMedications] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/medication.json")
      .then((res) => res.json())
      .then((data) => setMedications(data))
      .catch((err) => console.error("Failed to load medications:", err));
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    const filtered = medications.filter((med) =>
      med.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(value ? filtered : []);
  };

  const handleSelect = (suggestion: string) => {
    setInputValue(suggestion);
    setSuggestions([]);
    onSelect(suggestion); // 🔥 Trigger callback to parent
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter medication..."
        className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((med, index) => (
            <li
              key={index}
              onClick={() => handleSelect(med)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {med}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MedicationAutoSuggest;
