import { ChevronDown, ChevronUp } from "lucide-react";

const AccordionSection = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="rounded-lg overflow-hidden mb-6 shadow-md shadow-blue-100">
      <button
        className="w-full text-left p-3 bg-gray-200 font-semibold text-lg flex justify-between items-center"
        onClick={onToggle}
      >
        {title}
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default AccordionSection;
