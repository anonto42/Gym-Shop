import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

function Contact() {
   const [contacts, setContacts] = useState<ContactMessage[]>([{
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Support",
    message: "I need help with my account.",
    date: "2023-01-01"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john.doe@example.com",
    subject: "Support",
    message: "I need help with my account.",
    date: "2023-01-01"
  }]);

  // Fetch all submitted messages
  // useEffect(() => {
  //   const fetchContacts = async () => {
  //     const res = await fetch("/api/contact");
  //     if (res.ok) {
  //       const data = await res.json();
  //       setContacts(data);
  //     }
  //   };
  //   fetchContacts();
  // }, []);

  console.log(contacts);

  return (
    <div className='w-full h-[88vh] p-6'>
      <Card className="w-full">
      <CardHeader>
        <CardTitle>Contact & Support Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>List of all people who contacted you.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length > 0 ? (
              contacts.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>
                    <Badge variant="default">{item.subject}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[250px] truncate">
                    {item.message}
                  </TableCell>
                  <TableCell>{item.date}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No messages yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
    </div>
  )
}

export default Contact