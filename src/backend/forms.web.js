
// ==============================================
// 11. src/backend/forms.web.js (Backend API for Forms)
// ==============================================

import { webMethod, Permissions } from '@wix/web-method';
import { submissions } from '@wix/forms-backend';
import { elevate } from '@wix/auth';

// Get all form submissions
export const getFormSubmissions = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const results = await elevate(submissions.querySubmissionsByNamespace)()
                .eq("namespace", "wix.form_app.form")
                .descending("_createdDate")
                .limit(1000)
                .find();

            return {
                success: true,
                submissions: results.items,
                totalCount: results.totalCount
            };
        } catch (error) {
            console.error('Error fetching submissions:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
);

// Delete a form submission
export const deleteSubmission = webMethod(
    Permissions.Anyone,
    async (submissionId) => {
        try {
            await elevate(submissions.deleteSubmission)(submissionId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting submission:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
);

// Update a form submission
export const updateSubmission = webMethod(
    Permissions.Anyone,
    async (submissionId, updateData) => {
        try {
            const result = await elevate(submissions.updateSubmission)(submissionId, updateData);
            return {
                success: true,
                submission: result
            };
        } catch (error) {
            console.error('Error updating submission:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
);