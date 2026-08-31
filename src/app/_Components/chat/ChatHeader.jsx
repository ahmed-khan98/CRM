"use client";

import { memo } from "react";
import { Info, ArrowLeft } from "lucide-react";
import ChatTooltip from "@/app/_Components/chat/ChatTooltip";
import HeaderIdentity from "@/app/_Components/chat/header/HeaderIdentity";
import HeaderCallButtons from "@/app/_Components/chat/header/HeaderCallButtons";
import HeaderOptionsMenu from "@/app/_Components/chat/header/HeaderOptionsMenu";

function ChatHeader({
  theme,
  active,
  activeId,
  myId,
  peer,
  peerOnline,
  peerPresence,
  typingLabel,
  recordingLabel,
  headerMenuOpen,
  setHeaderMenuOpen,
  headerMenuRef,
  closeHeaderMenu,
  setMobileShowChat,
  setShowInfo,
  startOutgoing,
  updateConv,
  meRole,
  onAddMembers,
  setConfirmAction,
  setConfirmDeleteChat,
  adminDisable,
  adminEnable,
}) {
  return (
    <header
      className={`flex shrink-0 items-center gap-1.5 border-b px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${theme.header}`}
    >
      <button
        type="button"
        className="md:hidden shrink-0 rounded-full p-1.5 hover:bg-black/5 cursor-pointer"
        onClick={() => setMobileShowChat(false)}
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <HeaderIdentity
        active={active}
        myId={myId}
        peer={peer}
        peerOnline={peerOnline}
        peerPresence={peerPresence}
        typingLabel={typingLabel}
        recordingLabel={recordingLabel}
        onOpenInfo={() => setShowInfo(true)}
      />
      <div className="flex shrink-0 items-center">
        <HeaderCallButtons
          active={active}
          activeId={activeId}
          myId={myId}
          peer={peer}
          startOutgoing={startOutgoing}
        />
        <ChatTooltip label="Contact info" side="bottom">
          <button
            type="button"
            aria-label="Contact info"
            className="rounded-full p-1.5 hover:bg-black/5 cursor-pointer sm:p-2"
            onClick={() => setShowInfo((v) => !v)}
          >
            <Info className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
          </button>
        </ChatTooltip>
        <HeaderOptionsMenu
          headerMenuRef={headerMenuRef}
          headerMenuOpen={headerMenuOpen}
          setHeaderMenuOpen={setHeaderMenuOpen}
          closeHeaderMenu={closeHeaderMenu}
          active={active}
          myId={myId}
          meRole={meRole}
          updateConv={updateConv}
          setConfirmDeleteChat={setConfirmDeleteChat}
          setConfirmAction={setConfirmAction}
          onAddMembers={onAddMembers}
          adminDisable={adminDisable}
          adminEnable={adminEnable}
        />
      </div>
    </header>
  );
}

export default memo(ChatHeader);
