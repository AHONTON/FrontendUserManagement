import React, { useState } from "react";

const NotificationsList = ({ notifications = [] }) => {
  const [list, setList] = useState(notifications);

  const hideNotification = (index) => {
    setList(list.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2 overflow-y-auto max-h-64">
      {list.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Aucune notification</p>
      ) : (
        list.map((notif, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 bg-gray-100 rounded-md dark:bg-gray-700"
          >
            <span>{notif}</span>
            <button
              onClick={() => hideNotification(i)}
              className="text-gray-500 hover:text-red-500"
            >
              Masquer
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationsList;
