import { useRef, useState } from "react";

const Collapsible = ({ title, content, isOpen, onToggle }) => {
  const contentRef = useRef(null);
  return (
    <div className="w-full border-b border-white">
      <h3
        role="button"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${title}`}
        className=" flex h-16 w-full cursor-pointer items-center gap-5 text-left text-[20px] leading-6"
        onClick={onToggle}
      >
        <div className="relative flex h-[18px] w-[18px] items-center justify-center">
          <span className="inline-block h-[4px] w-[18px] rounded-[2px] bg-white"></span>
          <span
            className={`${
              !isOpen ? "rotate-90" : ""
            } absolute top-1/2 left-0 inline-block h-[4px] w-[18px] origin-center -translate-y-1/2 rounded-[2px] bg-white transition-all duration-500 ease-in-out`}
          ></span>
        </div>
        {title}
      </h3>
      <div
        id={`collapsible-${title}`}
        role="region"
        aria-labelledby={`collapsible-${title}`}
        ref={contentRef}
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        <div className="pb-5 text-[16px] leading-6">{content}</div>
      </div>
    </div>
  );
};

const CollapsibleList = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="flex flex-col gap-4 text-white max-md:w-full max-md:gap-0">
      {items.map((item, index) => (
        <Collapsible
          key={index}
          title={item.title}
          content={item.content}
          isOpen={activeIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </div>
  );
};

export default CollapsibleList;





