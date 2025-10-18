/**
 * Lead Notes Section Component
 * 
 * Displays existing notes and allows adding new ones
 */

'use client';

import { useState, useTransition } from 'react';
import { MessageSquare, Plus, Loader2, User, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { addAdminLeadNote } from '@/lib/actions/admin/leads';
import { useRouter } from 'next/navigation';

interface LeadNotesSectionProps {
  lead: any;
}

const noteTypes = [
  { value: 'note', label: 'Note', icon: '📝' },
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
];

export function LeadNotesSection({ lead }: LeadNotesSectionProps) {
  const [isPending, startTransition] = useTransition();
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('note');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    startTransition(async () => {
      try {
        const result = await addAdminLeadNote(lead.id, newNote.trim());
        
        if (result.success) {
          setMessage({ type: 'success', text: 'Note added successfully' });
          setNewNote('');
          setNoteType('note');
          // Refresh the page to show updated data
          router.refresh();
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      } catch (error) {
        setMessage({ 
          type: 'error', 
          text: 'Failed to add note. Please try again.' 
        });
      }
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center'>
          <MessageSquare className='h-5 w-5 mr-2' />
          Notes & Activity
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Add New Note */}
        <div className='space-y-3'>
          <h4 className='text-sm font-medium text-gray-900'>Add Note</h4>
          
          {/* Note Type Selection */}
          <div className='flex space-x-2'>
            {noteTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setNoteType(type.value)}
                className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                  noteType === type.value
                    ? 'bg-blue-100 border-blue-300 text-blue-800'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className='mr-1'>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>

          {/* Note Input */}
          <div className='space-y-2'>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder='Add a note about this lead...'
              className='w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows={3}
              disabled={isPending}
            />
            <div className='flex justify-end'>
              <Button
                onClick={handleAddNote}
                disabled={isPending || !newNote.trim()}
                size='sm'
              >
                {isPending ? (
                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                ) : (
                  <Plus className='h-4 w-4 mr-2' />
                )}
                Add Note
              </Button>
            </div>
          </div>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <p className={`text-sm ${
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {message.text}
            </p>
          </div>
        )}

        {/* Existing Notes */}
        <div>
          <h4 className='text-sm font-medium text-gray-900 mb-3'>
            Notes ({lead.notes?.length || 0})
          </h4>
          
          {lead.notes && lead.notes.length > 0 ? (
            <div className='space-y-3 max-h-96 overflow-y-auto'>
              {lead.notes
                .sort((a: any, b: any) => 
                  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                )
                .map((note: any, index: number) => {
                  const noteTypeConfig = noteTypes.find(t => t.value === note.type) || noteTypes[0];
                  
                  return (
                    <div key={index} className='p-3 bg-gray-50 rounded-lg'>
                      <div className='flex items-start justify-between mb-2'>
                        <div className='flex items-center'>
                          <span className='mr-2'>{noteTypeConfig?.icon || '📝'}</span>
                          <span className='text-sm font-medium text-gray-900'>
                            {noteTypeConfig?.label || 'Note'}
                          </span>
                        </div>
                        <div className='flex items-center text-xs text-gray-500'>
                          <Clock className='h-3 w-3 mr-1' />
                          {formatDate(note.createdAt)}
                        </div>
                      </div>
                      <p className='text-sm text-gray-700 mb-2 whitespace-pre-wrap'>
                        {note.content}
                      </p>
                      {note.author && (
                        <div className='flex items-center text-xs text-gray-500'>
                          <User className='h-3 w-3 mr-1' />
                          {note.author}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className='text-center py-6 text-gray-500'>
              <MessageSquare className='h-8 w-8 mx-auto mb-2 text-gray-300' />
              <p className='text-sm'>No notes yet. Add the first note above.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
