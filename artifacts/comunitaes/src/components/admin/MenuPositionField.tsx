import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  section: string;       // "none" | "top" | "dropdown:Nome"
  order: number;
  label: string;
  existingGroups?: string[];  // list of existing dropdown group names
  onChangeSection: (v: string) => void;
  onChangeOrder: (v: number) => void;
  onChangeLabel: (v: string) => void;
  compact?: boolean;     // smaller layout for fixed pages
}

function parseSection(section: string): { type: "none" | "top" | "dropdown"; group: string } {
  if (section === "top") return { type: "top", group: "" };
  if (section.startsWith("dropdown:")) return { type: "dropdown", group: section.slice(9) };
  // legacy value
  if (section === "institucional") return { type: "dropdown", group: "Institucional" };
  return { type: "none", group: "" };
}

export function MenuPositionField({ section, order, label, existingGroups = [], onChangeSection, onChangeOrder, onChangeLabel, compact }: Props) {
  const parsed = parseSection(section);
  const [dropdownInput, setDropdownInput] = useState(parsed.group);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const uniqueGroups = Array.from(new Set(existingGroups.filter(Boolean)));

  function setType(type: "none" | "top" | "dropdown") {
    if (type === "none") onChangeSection("none");
    else if (type === "top") onChangeSection("top");
    else onChangeSection(`dropdown:${dropdownInput || "Institucional"}`);
  }

  function handleGroupInput(val: string) {
    setDropdownInput(val);
    onChangeSection(`dropdown:${val}`);
  }

  const h = compact ? "h-8 text-sm" : "";

  return (
    <div className={`space-y-3 ${compact ? "p-4 bg-gray-50 rounded-xl border border-gray-200" : ""}`}>
      {compact && <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Posição no Menu</p>}

      <div className="grid grid-cols-3 gap-3">
        {/* Label */}
        <div className="space-y-1.5">
          <Label className="text-xs">Rótulo no menu</Label>
          <Input value={label} onChange={e => onChangeLabel(e.target.value)} className={h} />
        </div>

        {/* Section type */}
        <div className="space-y-1.5">
          <Label className="text-xs">Posição</Label>
          <select
            value={parsed.type}
            onChange={e => setType(e.target.value as "none" | "top" | "dropdown")}
            className={`w-full border border-input bg-background px-3 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-ring ${compact ? "h-8" : "py-2"}`}
          >
            <option value="none">Fora do menu</option>
            <option value="top">Menu principal</option>
            <option value="dropdown">Dropdown</option>
          </select>
        </div>

        {/* Order */}
        <div className="space-y-1.5">
          <Label className="text-xs">Ordem</Label>
          <Input type="number" min={0} value={order} onChange={e => onChangeOrder(parseInt(e.target.value) || 0)} className={h} />
        </div>
      </div>

      {/* Dropdown group name input */}
      {parsed.type === "dropdown" && (
        <div className="space-y-1.5 relative">
          <Label className="text-xs">Nome do dropdown</Label>
          <Input
            value={dropdownInput}
            onChange={e => handleGroupInput(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder="Ex: Institucional, Quem Somos, Cultura..."
            className={h}
          />
          {showSuggestions && uniqueGroups.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
              {uniqueGroups.map(g => (
                <button
                  key={g}
                  type="button"
                  onMouseDown={() => { handleGroupInput(g); setShowSuggestions(false); }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  {g}
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-400">Páginas com o mesmo nome formam um dropdown único no menu.</p>
        </div>
      )}
    </div>
  );
}
