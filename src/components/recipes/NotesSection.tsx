import React, { useState } from 'react';
import Image from 'next/image';

export interface RecipeNote {
  id: string;
  content: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  rating?: number;
  isHelpful?: boolean;
}

interface NotesSectionProps {
  notes: RecipeNote[];
  title?: string;
  className?: string;
  onAddNote?: (content: string) => void;
  onToggleHelpful?: (noteId: string) => void;
}

const NotesSection: React.FC<NotesSectionProps> = ({
  notes,
  title = 'Notes & Tips',
  className = '',
  onAddNote,
  onToggleHelpful,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onAddNote) {
        await onAddNote(newNote.trim());
        setNewNote('');
      }
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <section
      style={{ borderRadius: 20, overflow: 'hidden' }}
      className={`bg-white dark:bg-background-dark p-6 md:p-8 ${className} transition-all duration-200 hover:border hover:border-gray-300`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {title}
        </h2>
        <button
          type="button"
          className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-orange-600 transition shadow-none"
          onClick={() => document.getElementById('add-note-input')?.focus()}
        >
          Leave a Note
        </button>
      </div>

      {/* Notes List (max 5) */}
      {notes.length > 0 ? (
        <div className="space-y-6 mb-6">
          {notes.slice(0, 5).map((note) => (
            <article
              key={note.id}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 md:p-6 hover:shadow-sm transition-shadow"
            >
              {/* Note Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Author Avatar */}
                  <div className="flex-shrink-0">
                    {note.author.avatar ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={note.author.avatar}
                          alt={note.author.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {note.author.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Author Info */}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {note.author.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatRelativeTime(note.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                {note.rating && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < note.rating!
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69L9.049 2.927z" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>

              {/* Note Content */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                {note.content}
              </p>

              {/* Note Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => onToggleHelpful?.(note.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    note.isHelpful
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  {note.isHelpful ? 'Helpful' : 'Helpful?'}
                </button>

                <div className="flex items-center gap-3">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No notes yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Be the first to share your cooking tips and experience with this
            recipe!
          </p>
        </div>
      )}

      {/* See all notes button */}
      {notes.length > 5 && (
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className="font-medium focus:outline-none hover:no-underline hover:text-black cursor-pointer"
            style={{ color: '#9d9b9a' }}
            onClick={() => alert('See all notes feature coming soon!')}
          >
            See all {notes.length} notes
          </button>
        </div>
      )}

      {/* Add Note Row */}
      <form
        onSubmit={handleSubmitNote}
        className="flex items-center gap-3 mt-4"
      >
        {/* User Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={notes[0]?.author.avatar || '/profile-placeholder.png'}
            alt={notes[0]?.author.name || 'User'}
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
        {/* Text Field with Send Button absolutely inside input */}
        <div className="relative flex-1">
          <input
            id="add-note-input"
            type="text"
            value={newNote}
            onChange={() => {}}
            placeholder="Add your notes!"
            className="w-full px-4 py-2 rounded-[20px] transition-colors text-base bg-[#f6f6f6] dark:bg-[#222] text-gray-900 dark:text-white border border-transparent hover:border-gray-300 focus:border-gray-300"
            maxLength={500}
            readOnly
            style={{ borderRadius: '20px' }}
            onClick={(e) => {
              e.currentTarget.blur();
              alert('Add note feature coming soon!');
            }}
          />
        </div>
      </form>
    </section>
  );
};

export default NotesSection;
