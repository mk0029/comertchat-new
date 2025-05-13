import { CometChat, Group } from "@cometchat/chat-sdk-javascript";
import { CometChatGroups } from "@cometchat/chat-uikit-react";
import React, { useEffect, useState } from "react";
import "../../styles/CometChatSelector/FilteredCometChatGroups.css";

interface FilteredCometChatGroupsProps {
  activeGroup?: Group;
  headerView?: JSX.Element;
  onItemClick?: (group: Group) => void;
}

/**
 * A wrapper for the CometChatGroups component that only shows groups
 * where the user is a member (invited or joined)
 */
export const FilteredCometChatGroups: React.FC<FilteredCometChatGroupsProps> = (
  props
) => {
  const { activeGroup, headerView, onItemClick } = props;

  // Creating a custom request builder configuration
  const [requestBuilder, setRequestBuilder] = useState<any>(null);

  useEffect(() => {
    // Initialize the request builder
    const builder = new CometChat.GroupsRequestBuilder();
    builder.setLimit(30);
    builder.joinedOnly(true);

    setRequestBuilder(builder);
  }, []);

  if (!requestBuilder) {
    return null; // Or a loading indicator
  }

  return (
    <div className="filtered-cometchat-groups w-full">
      <CometChatGroups
        activeGroup={activeGroup}
        headerView={headerView}
        onItemClick={onItemClick}
        groupsRequestBuilder={requestBuilder}
      />
    </div>
  );
};
