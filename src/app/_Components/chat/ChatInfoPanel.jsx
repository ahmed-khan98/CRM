"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";
import InfoPanelHeader from "@/app/_Components/chat/info/InfoPanelHeader";
import InfoProfile from "@/app/_Components/chat/info/InfoProfile";
import SharedMediaSection from "@/app/_Components/chat/info/SharedMediaSection";
import GroupMembersSection from "@/app/_Components/chat/info/GroupMembersSection";
import RecentCallsList from "@/app/_Components/chat/info/RecentCallsList";

function ChatInfoPanel({
  theme,
  active,
  activeId,
  myId,
  peer,
  iAmGroupAdmin,
  mediaTab,
  setMediaTab,
  mediaData,
  callsData,
  setShowInfo,
  setShowAddMembers,
  setConfirmAction,
  setConfirmDeleteChat,
}) {
  return (
    <aside
      className={`flex flex-col border-l ${theme.side} fixed inset-0 z-[60] w-full overflow-y-auto lg:static lg:inset-auto lg:z-auto lg:w-[320px] lg:shrink-0 lg:overflow-hidden`}
    >
      <InfoPanelHeader
        theme={theme}
        isGroup={active.type === "group"}
        onClose={() => setShowInfo(false)}
      />
      <InfoProfile active={active} myId={myId} peer={peer} />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-6">
        <SharedMediaSection
          mediaTab={mediaTab}
          setMediaTab={setMediaTab}
          mediaData={mediaData}
        />
        {active.type === "group" && (
          <GroupMembersSection
            active={active}
            activeId={activeId}
            myId={myId}
            iAmGroupAdmin={iAmGroupAdmin}
            setShowAddMembers={setShowAddMembers}
            setConfirmAction={setConfirmAction}
          />
        )}
        {active.type === "direct" && peer && (
          <button
            type="button"
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
            onClick={() => setConfirmDeleteChat(activeId)}
          >
            <Trash2 className="h-4 w-4" /> Delete chat
          </button>
        )}
        <RecentCallsList callsData={callsData} />
      </div>
    </aside>
  );
}

export default memo(ChatInfoPanel);
