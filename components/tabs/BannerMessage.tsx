"use client";
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '@radix-ui/react-label';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import { 
  getAllBannerMessagesServerSide, 
  createBannerMessageServerSide, 
  updateBannerMessageServerSide, 
  deleteBannerMessageServerSide,
  reorderBannerMessagesServerSide 
} from '@/server/functions/banner.fun';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from '@hello-pangea/dnd';
import { GripVertical, Trash2, Edit, Save, X } from 'lucide-react';

interface BannerMessage {
  _id: string;
  text: string;
  icon: string;
  isActive: boolean;
  order: number;
}

interface IBannerResponseData {
  messages: BannerMessage[];
}

function BannerManagement() {
  const [messages, setMessages] = useState<BannerMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState({ text: '', icon: '🔹' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await getAllBannerMessagesServerSide();
      if (!response.isError && response.data) {
        const {messages} = response.data as IBannerResponseData;
        setMessages(messages || []);
      }
    } catch {
      toast.error('Failed to fetch banner messages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if (!newMessage.text.trim()) {
      toast.error('Message text is required');
      return;
    }

    setLoading(true);
    try {
      const response = await createBannerMessageServerSide(newMessage.text, newMessage.icon);
      if (response.isError) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        setNewMessage({ text: '', icon: '🔹' });
        fetchMessages();
      }
    } catch {
      toast.error('Failed to create message');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (messageId: string, isActive: boolean) => {
    try {
      const response = await updateBannerMessageServerSide(messageId, { isActive });
      if (response.isError) {
        toast.error(response.message);
      } else {
        toast.success('Message status updated');
        fetchMessages();
      }
    } catch {
      toast.error('Failed to update message status');
    }
  };

  const handleEdit = (message: BannerMessage) => {
    setEditingId(message._id);
    setEditText(message.text);
  };

  const handleSaveEdit = async (messageId: string) => {
    if (!editText.trim()) {
      toast.error('Message text is required');
      return;
    }

    try {
      const response = await updateBannerMessageServerSide(messageId, { text: editText });
      if (response.isError) {
        toast.error(response.message);
      } else {
        toast.success('Message updated successfully');
        setEditingId(null);
        setEditText('');
        fetchMessages();
      }
    } catch {
      toast.error('Failed to update message');
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await deleteBannerMessageServerSide(messageId);
      if (response.isError) {
        toast.error(response.message);
      } else {
        toast.success('Message deleted successfully');
        fetchMessages();
      }
    } catch {
      toast.error('Failed to delete message');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(messages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setMessages(items);

    // Update order in database
    try {
      const orderedIds = items.map(item => item._id);
      await reorderBannerMessagesServerSide(orderedIds);
      toast.success('Order updated successfully');
    } catch {
      toast.error('Failed to update order');
      fetchMessages(); // Revert on error
    }
  };

  const commonIcons = ['🔹', '🚚', '💸', '📦', '🔥', '🌍', '🥇', '⭐', '🎯', '💎'];

  return (
    <div className="w-full min-h-[88vh] p-4">
      <div className="w-full h-full bg-white border rounded-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Banner Messages Management</h1>
        </div>

        {/* Add New Message */}
        <div className="mb-8 p-6 border rounded-2xl bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Add New Message</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Message Text *</Label>
              <Input
                placeholder="Enter banner message"
                value={newMessage.text}
                onChange={(e) => setNewMessage({ ...newMessage, text: e.target.value })}
                className="p-3 border-2 border-gray-200 rounded-lg"
              />
            </div>
            
            <div className="flex flex-col">
              <Label className="text-sm font-medium mb-2">Icon</Label>
              <select
                value={newMessage.icon}
                onChange={(e) => setNewMessage({ ...newMessage, icon: e.target.value })}
                className="p-3 border-2 border-gray-200 rounded-lg"
              >
                {commonIcons.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleCreateMessage}
                className="bg-[#125BAC] hover:bg-[#0f4a8c] cursor-pointer w-full"
                disabled={loading || !newMessage.text.trim()}
              >
                Add Message
              </Button>
            </div>
          </div>
        </div>

        {/* Messages List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Manage Messages ({messages.length})</h2>
          
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No banner messages found. Add your first message above.
            </div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="banner-messages">
                {(provided: DroppableProvided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {messages.map((message, index) => (
                      <Draggable key={message._id} draggableId={message._id} index={index}>
                        {(provided: DraggableProvided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center gap-4 p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                          >
                            {/* Drag Handle */}
                            <div {...provided.dragHandleProps} className="cursor-grab">
                              <GripVertical className="w-5 h-5 text-gray-400" />
                            </div>

                            {/* Icon */}
                            <div className="text-2xl">{message.icon}</div>

                            {/* Message Text */}
                            <div className="flex-1">
                              {editingId === message._id ? (
                                <Input
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="p-2 border rounded"
                                />
                              ) : (
                                <span className={`text-lg ${!message.isActive ? 'text-gray-400 line-through' : ''}`}>
                                  {message.text}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {/* Status Toggle */}
                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={message.isActive}
                                  onCheckedChange={(checked) => handleUpdateStatus(message._id, checked)}
                                />
                                <Label className="text-sm">
                                  {message.isActive ? 'Active' : 'Inactive'}
                                </Label>
                              </div>

                              {/* Edit/Save */}
                              {editingId === message._id ? (
                                <>
                                  <Button
                                    onClick={() => handleSaveEdit(message._id)}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Save className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    onClick={() => setEditingId(null)}
                                    size="sm"
                                    variant="outline"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  onClick={() => handleEdit(message)}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}

                              {/* Delete */}
                              <Button
                                onClick={() => handleDelete(message._id)}
                                size="sm"
                                variant="outline"
                                className="text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
}

export default BannerManagement;