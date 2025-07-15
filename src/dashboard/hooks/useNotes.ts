import { useState, useCallback } from 'react';

export interface Note {
    _id: string;
    submissionId: string;
    email: string;
    name: string;
    notes: string;
    _createdDate: string;
    _updatedDate: string;
}

export const useNotes = () => {
    const [notes, setNotes] = useState<{ [submissionId: string]: Note }>({});
    const [loadingNotes, setLoadingNotes] = useState<{ [submissionId: string]: boolean }>({});

    // Debounce function for saving notes
    const debounce = (func: Function, delay: number) => {
        let timeoutId: number;
        return (...args: any[]) => {
            clearTimeout(timeoutId);
            timeoutId = window.setTimeout(() => func.apply(null, args), delay);
        };
    };

    const loadNoteForSubmission = useCallback(async (submissionId: string, email: string, name: string) => {
        if (notes[submissionId] || loadingNotes[submissionId]) {
            return notes[submissionId] || null;
        }

        setLoadingNotes(prev => ({ ...prev, [submissionId]: true }));

        try {
            // Create a mock note - this will be stored in local state
            // Later you can replace this with actual API calls
            const note: Note = {
                _id: `note_${submissionId}`,
                submissionId,
                email,
                name,
                notes: localStorage.getItem(`note_${submissionId}`) || '', // Persist to localStorage
                _createdDate: new Date().toISOString(),
                _updatedDate: new Date().toISOString()
            };

            setNotes(prev => ({ ...prev, [submissionId]: note }));
            return note;
        } catch (error) {
            console.error(`Error loading note for submission ${submissionId}:`, error);
            return null;
        } finally {
            setLoadingNotes(prev => ({ ...prev, [submissionId]: false }));
        }
    }, [notes, loadingNotes]);

    const saveNote = useCallback(
        debounce(async (submissionId: string, email: string, name: string, noteText: string) => {
            try {
                // Save to localStorage for now - replace with actual API call later
                localStorage.setItem(`note_${submissionId}`, noteText);
                console.log('Saving note:', { submissionId, noteText });

                setNotes(prev => ({
                    ...prev,
                    [submissionId]: {
                        ...prev[submissionId],
                        notes: noteText,
                        _updatedDate: new Date().toISOString()
                    }
                }));
            } catch (error) {
                console.error('Error saving note:', error);
            }
        }, 1000),
        []
    );

    const updateNoteText = (submissionId: string, noteText: string) => {
        setNotes(prev => ({
            ...prev,
            [submissionId]: {
                ...prev[submissionId],
                notes: noteText
            }
        }));
    };

    return {
        notes,
        loadingNotes,
        loadNoteForSubmission,
        saveNote,
        updateNoteText
    };
};