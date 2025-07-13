import React, { useState, useRef, useEffect } from "react";

interface ReportTextareaProps {
  value: string;
  onChange: (value: string) => void;
  medications: string[];
}

const ReportTextarea: React.FC<ReportTextareaProps> = ({
  value,
  onChange,
  medications,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [caretPos, setCaretPos] = useState<number>(0);
  const [medications, setMedications] = useState<string[]>([]);
  const getCurrentWord = (text: string, pos: number) => {
    const left = text.slice(0, pos);
    const right = text.slice(pos);
    const leftWord = left.split(/\s/).pop() || "";
    const rightWord = right.split(/\s/)[0] || "";
    return leftWord + rightWord;
  };

  useEffect(() => {
    fetch("/medications.json")
      .then((res) => res.json())
      .then((data) => {
        const flatList = new Set<string>();
        for (const category in data) {
          data[category].forEach((med: any) => {
            if (med.Generic) flatList.add(med.Generic);
            med.Brands?.forEach((brand: string) => flatList.add(brand));
          });
        }
        setMedications(Array.from(flatList));
      });
  }, []);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const pos = e.target.selectionStart;
    setCaretPos(pos);
    onChange(newText);

    const currentWord = getCurrentWord(newText, pos);
    if (currentWord.length > 1) {
      const filtered = medications.filter((m) =>
        m.toLowerCase().startsWith(currentWord.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setActiveIndex(0);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      insertSuggestion(suggestions[activeIndex]);
    }
  };

  const insertSuggestion = (textToInsert: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const originalText = value;
    const start = originalText.slice(0, caretPos).replace(/\S+$/, "");
    const end = originalText.slice(caretPos).replace(/^\S+/, "");
    const newText = start + textToInsert + " " + end;

    onChange(newText);
    setSuggestions([]);

    setTimeout(() => {
      const newCursor = (start + textToInsert + " ").length;
      textarea.setSelectionRange(newCursor, newCursor);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        rows={6}
        placeholder="Write detailed patient report..."
        value={value}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
      ></textarea>

      {suggestions.length > 0 && (
        <ul className="absolute z-50 bg-white border border-blue-300 rounded mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
          {suggestions.map((item, idx) => (
            <li
              key={item}
              onMouseDown={() => insertSuggestion(item)}
              className={`px-4 py-2 cursor-pointer ${
                idx === activeIndex ? "bg-blue-100 font-semibold" : ""
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReportTextarea;
