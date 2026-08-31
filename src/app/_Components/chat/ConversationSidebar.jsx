"use client";

import { memo, useMemo, useState } from "react";
import SidebarHeader from "@/app/_Components/chat/sidebar/SidebarHeader";
import SidebarSearch from "@/app/_Components/chat/sidebar/SidebarSearch";
import ConversationList from "@/app/_Components/chat/sidebar/ConversationList";
import { conversationTitle } from "@/app/_Components/chat/chatUtils";

function ConversationSidebar({
  theme,
  dark,
  connected,
  mobileShowChat,
  listFilter,
  setListFilter,
  conversations,
  activeId,
  myId,
  onlineOf,
  openChat,
  onToggleDark,
  onNewChat,
  onSearchMessages,
  onOpenListMenu,
}) {
  const [filter, setFilter] = useState("");

  const filteredConvs = useMemo(() => {
    const q = filter.trim().toLowerCase();
    let list = conversations;
    if (listFilter === "groups") {
      list = list.filter((c) => c.type === "group");
    }
    if (!q) return list;
    return list.filter((c) => conversationTitle(c, myId).toLowerCase().includes(q));
  }, [conversations, filter, listFilter, myId]);

  return (
    <aside
      className={`${
        mobileShowChat ? "hidden md:flex" : "flex"
      } w-full md:w-[320px] lg:w-[360px] min-h-0 flex-col border-r ${theme.side}`}
    >
      <SidebarHeader
        theme={theme}
        dark={dark}
        connected={connected}
        onToggleDark={onToggleDark}
        onNewChat={onNewChat}
      />
      <SidebarSearch
        theme={theme}
        dark={dark}
        filter={filter}
        onFilterChange={(e) => {
          setFilter(e.target.value);
          if (e.target.value.length > 1) onSearchMessages(e.target.value);
        }}
        listFilter={listFilter}
        setListFilter={setListFilter}
      />
      <ConversationList
        dark={dark}
        listFilter={listFilter}
        filteredConvs={filteredConvs}
        activeId={activeId}
        myId={myId}
        onlineOf={onlineOf}
        openChat={openChat}
        onOpenListMenu={onOpenListMenu}
        theme={theme}
      />
    </aside>
  );
}

export default memo(ConversationSidebar);
