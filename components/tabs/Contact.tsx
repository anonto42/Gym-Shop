"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    getAllContactMessagesServerSide,
    markContactMessageAsReadServerSide,
    deleteContactMessageServerSide
} from '@/server/functions/contact.fun';
import { IContactMessage } from '@/server/models/contact/contact.interface';
import { toast } from 'sonner';

function Contact() {
    const [contacts, setContacts] = useState<IContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const result = await getAllContactMessagesServerSide();
            if (!result.isError && result.data) {
                const { messages } = result.data as { messages: IContactMessage[] };
                setContacts(messages);
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch contacts");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const result = await markContactMessageAsReadServerSide(id);
            if (!result.isError) {
                toast.success("Message marked as read");
                fetchContacts(); // Refresh the list
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to update message");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;

        try {
            const result = await deleteContactMessageServerSide(id);
            if (!result.isError) {
                toast.success("Message deleted successfully");
                fetchContacts(); // Refresh the list
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete message");
        }
    };

    const getStatusBadge = (status: string, isRead: boolean) => {
        const variants = {
            pending: "destructive",
            replied: "default",
            resolved: "secondary"
        } as const;

        return (
            <Badge variant={variants[status as keyof typeof variants]}>
                {status} {!isRead && "•"}
            </Badge>
        );
    };

    if (loading) {
        return <div className="w-full h-[88vh] p-6">Loading...</div>;
    }

    return (
        <div className='w-full h-[88vh] p-6 overflow-auto'>
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
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contacts.length > 0 ? (
                                contacts.map((item) => (
                                    <TableRow
                                        key={item?._id?.toString()}
                                        className={!item.isRead ? "bg-blue-50 font-medium" : ""}
                                    >
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.email}</TableCell>
                                        <TableCell>{item.subject}</TableCell>
                                        <TableCell className="max-w-[250px] truncate" title={item.message}>
                                            {item.message}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(item.status, item.isRead)}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                {!item.isRead && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(item?._id?.toString() as string)}
                                                    >
                                                        Mark Read
                                                    </Button>
                                                )}
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(item?._id?.toString() as string)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center">
                                        No messages yet
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default Contact;