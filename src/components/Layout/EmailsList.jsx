import React from "react";

const EmailsList = ({ emails = [] }) => {
  return (
    <div className="space-y-2 overflow-y-auto max-h-64">
      {emails.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-300">Aucun message</p>
      ) : (
        emails.map((email, i) => (
          <div
            key={i}
            className="flex flex-col p-2 bg-gray-100 rounded-md dark:bg-gray-700"
          >
            <span className="font-semibold">{email.sender}</span>
            <span className="text-sm">{email.subject}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default EmailsList;
