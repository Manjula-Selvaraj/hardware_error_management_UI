import React from "react";
import { Table } from "react-bootstrap";

const InboxTable = () => {
  const messages = [
    { id: 1, subject: "New ticket assigned", status: "Open" },
    { id: 2, subject: "Update on project", status: "In Progress" },
    { id: 3, subject: "Meeting rescheduled", status: "Closed" },
  ];

  return (
    <Table striped bordered hover className="mt-4">
      <thead>
        <tr>
          <th>#</th>
          <th>Subject</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {messages.map(msg => (
          <tr key={msg.id}>
            <td>{msg.id}</td>
            <td>{msg.subject}</td>
            <td>{msg.status}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InboxTable;
