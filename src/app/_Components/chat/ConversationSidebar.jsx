"use client";

import { memo } from "react";
import { Search, Plus } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import ConversationRow from "@/app/_Components/chat/ConversationRow";
import { conversationPeer } from "@/app/_Components/chat/chatUtils";

function ConversationSidebar({
  theme,
  dark,
  connected,
  mobileShowChat,
  filter,
  setFilter,
  listFilter,
  setListFilter,
  filteredConvs,
  activeId,
  myId,
  onlineOf,
  openChat,
  onToggleDark,
  onNewChat,
  onSearchMessages,
}) {
  return (
    <aside
      className={`${
        mobileShowChat ? "hidden md:flex" : "flex"
      } w-full md:w-[320px] lg:w-[360px] flex-col border-r ${theme.side}`}
    >
      <div className={`flex items-center justify-between px-3 py-2 border-b ${theme.header}`}>
        <div>
          <h1 className="text-lg font-bold">Chats</h1>
          <p className="text-[11px] text-zinc-500">
            {connected ? "Connected" : "Connecting…"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <ChatTooltip label={dark ? "Light mode" : "Dark mode"} side="bottom">
            <button
              type="button"
              onClick={onToggleDark}
              className="rounded-lg px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {dark ? "Light" : "Dark"}
            </button>
          </ChatTooltip>
          <ChatTooltip label="New chat" side="bottom">
            <button
              type="button"
              onClick={onNewChat}
              className="rounded-full p-2 hover:bg-black/5"
            >
              <Plus className="h-5 w-5" />
            </button>
          </ChatTooltip>
        </div>
      </div>

      <div className="px-3 py-2 space-y-2">
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${theme.input} border`}>
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              if (e.target.value.length > 1) {
                onSearchMessages(e.target.value);
              }
            }}
            placeholder="Search or start new chat"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setListFilter("all")}
            className={`rounded-full px-3 py-1 font-medium ${
              listFilter === "all" ? theme.chipOn : theme.chipOff
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setListFilter("groups")}
            className={`rounded-full px-3 py-1 font-medium ${
              listFilter === "groups" ? theme.chipOn : theme.chipOff
            }`}
          >
            Groups
          </button>
          <button
            type="button"
            onClick={() => setListFilter("archived")}
            className={`rounded-full px-3 py-1 font-medium ${
              listFilter === "archived" ? theme.chipOn : theme.chipOff
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
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
          const listOnline = listPeer?._id ? onlineOf(listPeer._id) : false;
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
            />
          );
        })}
      </div>
    </aside>
  );
}

export default memo(ConversationSidebar);
