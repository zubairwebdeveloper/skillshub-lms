"use client";

import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const MentionList = forwardRef(function MentionList(props, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [props.items]);

  const selectItem = (index) => {
    const item = props.items[index];
    if (item) props.command({ id: item });
  };

  const upHandler = () =>
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );

  const downHandler = () =>
    setSelectedIndex((selectedIndex + 1) % props.items.length);

  const enterHandler = () => selectItem(selectedIndex);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }
      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }
      if (event.key === "Enter") {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  if (!props.items.length) {
    return (
      <div className="rounded-md border bg-popover p-2 text-sm text-muted-foreground shadow-md">
        No results
      </div>
    );
  }

  return (
    <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
      {props.items.map((item, index) => (
        <button
          type="button"
          key={item}
          onClick={() => selectItem(index)}
          className={`rounded px-2 py-1.5 text-left text-sm ${
            index === selectedIndex
              ? "bg-accent text-accent-foreground"
              : "hover:bg-muted"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
});

export default MentionList;
