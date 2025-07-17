import { webMethod, Permissions } from '@wix/web-method';
import { submissions } from '@wix/forms';
import { auth } from '@wix/essentials';

// Create elevated updateSubmission function
const elevatedUpdateSubmission = auth.elevate(submissions.updateSubmission);

// Update form submission with elevation
export const updateFormSubmission = webMethod(
    Permissions.Anyone,
    async (submissionId, updateData) => {
        try {
            console.log('Backend: Updating submission with ID:', submissionId);
            console.log('Backend: Update data:', updateData);

            // Validate required fields
            if (!updateData.formId || updateData.formId.trim() === '') {
                throw new Error('FormId is missing or empty');
            }
            if (!updateData.revision || updateData.revision.trim() === '') {
                throw new Error('Revision is missing or empty');
            }

            // Use elevated updateSubmission
            const result = await elevatedUpdateSubmission(submissionId, updateData);

            console.log('Backend: Update successful:', result);

            return {
                success: true,
                submission: result,
                debug: {
                    submissionId,
                    updateData,
                    result
                }
            };
        } catch (error) {
            console.error('Backend: Error updating submission:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
                debug: {
                    submissionId,
                    updateData,
                    error: error
                }
            };
        }
    }
);

// Get all form submissions
export const getFormSubmissions = webMethod(
    Permissions.Anyone,
    async () => {
        try {
            const results = await auth.elevate(submissions.querySubmissionsByNamespace)()
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
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
);

// Delete a form submission
export const deleteFormSubmission = webMethod(
    Permissions.Anyone,
    async (submissionId) => {
        try {
            await auth.elevate(submissions.deleteSubmission)(submissionId);
            return { success: true };
        } catch (error) {
            console.error('Error deleting submission:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
);