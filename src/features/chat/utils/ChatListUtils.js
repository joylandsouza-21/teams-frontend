
export function generateChatLable(chat, currentUserId) {

    let label = "";

    if (chat.type === "direct") {
      label = chat.members?.filter(item=>Number(item.id) !== Number(currentUserId))?.[0].name;
    }
    else if (chat.type === "group") {
      if (chat.name) {
        label = chat.name;
      }
      else if (chat.members?.length) {
        const MAX_LENGTH = 18;
        let usedLength = 0;
        let visibleNames = [];
        let remainingCount = 0;

        for (let i = 0; i < chat.members.length; i++) {
          const firstWord = chat.members[i].name.split(" ")[0];
          const nextLength =
            usedLength + firstWord.length + (visibleNames.length ? 2 : 0);

          if (nextLength <= MAX_LENGTH) {
            visibleNames.push(firstWord);
            usedLength = nextLength;
          } else {
            remainingCount = chat.members.length - i;
            break;
          }
        }

        label =
          remainingCount > 0
            ? `${visibleNames.join(", ")}, +${remainingCount}`
            : visibleNames.join(", ");
      }
      else {
        label = "Unnamed Group";
      }
    }
    return label
  }