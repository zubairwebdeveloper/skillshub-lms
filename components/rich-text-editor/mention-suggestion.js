import { ReactRenderer } from "@tiptap/react";
import tippy from "tippy.js";
import MentionList from "./mention-list";

// Replace this with real users (students / instructors) fetched from Firestore.
const DEFAULT_MENTION_ITEMS = [
  "Ali Raza",
  "Sara Khan",
  "Ahmed Bilal",
  "Fatima Noor",
  "Usman Tariq",
];

export function createMentionSuggestion(items = DEFAULT_MENTION_ITEMS) {
  return {
    items: ({ query }) =>
      items
        .filter((item) => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 6),

    render: () => {
      let component;
      let popup;

      return {
        onStart: (props) => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          });

          if (!props.clientRect) return;

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },

        onUpdate(props) {
          component.updateProps(props);
          if (!props.clientRect) return;
          popup[0].setProps({ getReferenceClientRect: props.clientRect });
        },

        onKeyDown(props) {
          if (props.event.key === "Escape") {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props) ?? false;
        },

        onExit() {
          popup[0].destroy();
          component.destroy();
        },
      };
    },
  };
}
