"use client";

import { memo } from "react";
import ConversationRow from "@/app/_Components/chat/ConversationRow";
import { conversationPeer, isSelfChat } from "@/app/_Components/chat/chatUtils";

function ConversationList({
  dark,
  listFilter,
  filteredConvs,
  activeId,
  myId,
  onlineOf,
  openChat,
  onOpenListMenu,
  theme,
}) {
  return (
    <div
      className={`min-h-0 flex-1 overflow-y-auto ${
        dark ? "custom-scrollbar-dark" : "custom-scrollbar"
      }`}
    >
      {filteredConvs.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-zinc-500">
          {listFilter === "groups"
            ? "No groups yet. Create a new group."
            : listFilter === "archived"
              ? "No archived chats."
              : "No conversations yet. Start a new chat."}
        </p>
      )}
      {filteredConvs.map((c) => {
        const listPeer = conversationPeer(c, myId);
        const listOnline =
          !isSelfChat(c, myId) && listPeer?._id ? onlineOf(listPeer._id) : false;
        return (
          <ConversationRow
            key={c._id}
            conv={c}
            selected={c._id === activeId}
            myId={myId}
            dark={dark}
            theme={theme}
            online={listOnline}
            onOpen={openChat}
            onOpenMenu={onOpenListMenu}
          />
        );
      })}
    </div>
  );
}

export default memo(ConversationList);
