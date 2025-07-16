export interface BackendResponse<T = any> {
    success: boolean;
    error?: string;
    note?: T;
}

export interface Note {
    _id: string;
    submissionId: string;
    email: string;
    name: string;
    notes: string;
    _createdDate: string;
    _updatedDate: string;
}

export declare const getNoteForSubmission: (submissionId: string) => Promise<BackendResponse<Note>>;
export declare const saveNote: (submissionId: string, email: string, name: string, noteText: string, noteId?: string | null) => Promise<BackendResponse<Note>>;