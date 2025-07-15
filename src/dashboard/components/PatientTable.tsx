// ==============================================
// FIXED: PatientTable.tsx - Corrected Pagination Props
// ==============================================

import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Text,
    Avatar,
    Badge,
    Pagination,
    PopoverMenu,
    Box,
    Search,
    Card,
    TableToolbar,
    TableActionCell,
    Input,
    IconButton
} from '@wix/design-system';
import * as Icons from '@wix/wix-ui-icons-common';
import { PatientSubmission } from '../types';
import { formatToGermanDate, calculateAge } from '../utils/helpers';
import { useNotes } from '../hooks/useNotes';



interface PatientTableProps {
    patients: PatientSubmission[];
    onViewPatient: (patient: PatientSubmission) => void;
    onPrintPatient: (patient: PatientSubmission) => void;
    onDeletePatient: (patientId: string) => void;
    onUpdatePatientStatus: (patientId: string, status: string) => void;
    searchTerm: string;
    onSearchChange: (value: string) => void;
    totalPatients: number;
}

const ITEMS_PER_PAGE = 40;

export const PatientTable: React.FC<PatientTableProps> = ({
    patients,
    onViewPatient,
    onPrintPatient,
    onDeletePatient,
    onUpdatePatientStatus,
    searchTerm,
    onSearchChange,
    totalPatients,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [expandedNotes, setExpandedNotes] = useState<{ [key: string]: boolean }>({});



    const handleNoteChange = (submissionId: string, noteText: string) => {
        updateNoteText(submissionId, noteText);
        const patient = patients.find(p => p._id === submissionId);
        if (patient) {
            const email = patient.submissions.email_726a?.trim() || '';
            const name = `${patient.submissions.vorname || ''} ${patient.submissions.name_1 || ''}`.trim();
            saveNote(submissionId, email, name, noteText);
        }
    };

    const toggleNoteExpansion = (submissionId: string) => {
        setExpandedNotes(prev => ({
            ...prev,
            [submissionId]: !prev[submissionId]
        }));
    };

    // Use the notes hook
    const { notes, loadingNotes, loadNoteForSubmission, saveNote, updateNoteText } = useNotes();
    // Filter patients based on search term
    const filteredPatients = patients.filter(patient => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.toLowerCase();
        return fullName.includes(searchLower);
    });

    const [isChangingPage, setIsChangingPage] = useState(false);

    // Reset to first page when patients data changes
    useEffect(() => {
        setCurrentPage(1);
    }, [patients.length]);

    const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredPatients.length);

    // Sort patients
    const sortedPatients = [...filteredPatients].sort((a, b) => {
        let aValue, bValue;

        switch (sortField) {
            case 'name':
                aValue = `${a.submissions.name_1 || ''} ${a.submissions.vorname || ''}`.trim();
                bValue = `${b.submissions.name_1 || ''} ${b.submissions.vorname || ''}`.trim();
                break;
            case 'date':
                aValue = a.submissions.date_5bd8 || a._createdDate;
                bValue = b.submissions.date_5bd8 || b._createdDate;
                break;
            case 'age':
                aValue = a.submissions.geburtsdatum || '';
                bValue = b.submissions.geburtsdatum || '';
                break;
            default:
                return 0;
        }

        if (sortOrder === 'asc') {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });

    const currentPatients = sortedPatients.slice(startIndex, endIndex);

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const columns = [
        {
            title: 'Name',
            width: '30%',
            minWidth: '200px',
            render: (patient: PatientSubmission) => {
                const note = notes[patient._id];
                const isExpanded = expandedNotes[patient._id];
                const hasNote = note && note.notes && note.notes.trim() !== '';
                const showNoteInput = hasNote || isExpanded;

                return (
                    <Box direction="horizontal" gap="SP2" style={{ alignItems: 'flex-start' }}>
                        <Avatar size="size24" />
                        <Box direction="vertical" gap="SP1" style={{ flex: 1 }}>
                            <Text size="small">
                                {`${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.trim()}
                            </Text>

                            {/* Show existing note as text */}
                            {hasNote && !isExpanded && (
                                <Box
                                    style={{
                                        padding: '4px 8px',
                                        backgroundColor: '#F3F4F6',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        position: 'relative'
                                    }}
                                >
                                    <IconButton
                                        skin="inverted"
                                        size="tiny"
                                        onClick={() => toggleNoteExpansion(patient._id)}
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            backgroundColor: 'transparent',
                                            border: 'none'
                                        }}
                                    >
                                        <div style={{ opacity: 0 }}>edit</div>
                                    </IconButton>
                                    <Text size="tiny" secondary>
                                        {note.notes}
                                    </Text>
                                </Box>
                            )}

                            {/* Show input when editing or adding new note */}
                            {showNoteInput && isExpanded && (
                                <Box style={{ width: '100%', maxWidth: '250px' }}>
                                    <Input
                                        placeholder="Notiz hinzufügen..."
                                        value={note?.notes || ''}
                                        onChange={(e) => handleNoteChange(patient._id, e.target.value)}
                                        size="small"
                                        status={loadingNotes[patient._id] ? 'loading' : undefined}
                                        onBlur={() => {
                                            // Close input if note is empty
                                            if (!note?.notes?.trim()) {
                                                toggleNoteExpansion(patient._id);
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                toggleNoteExpansion(patient._id);
                                            }
                                            if (e.key === 'Escape') {
                                                toggleNoteExpansion(patient._id);
                                            }
                                        }}
                                    />
                                </Box>
                            )}

                            {/* Show add note button when no note exists and not expanded */}
                            {!hasNote && !isExpanded && (
                                <Box>
                                    <Button
                                        skin="light"
                                        size="tiny"
                                        onClick={() => toggleNoteExpansion(patient._id)}
                                        prefixIcon={<Icons.Add />}
                                    >
                                        Notiz
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Box>
                );
            },
        },
        {
            title: `Datum (${sortField === 'date' && sortOrder === 'desc' ? 'Neueste' : 'Älteste'})`,
            width: '15%',
            minWidth: '120px',
            render: (patient: PatientSubmission) => (
                <Text size="small">
                    {formatToGermanDate(patient.submissions.date_5bd8 || patient._createdDate)}
                </Text>
            ),
            sortable: true,
            sortDescending: sortField === 'date' ? sortOrder === 'desc' : undefined,
            onSortClick: () => handleSort('date'),
        },
        {
            title: 'Alter',
            width: '15%',
            minWidth: '300px',
            render: (patient: PatientSubmission) => (
                <Text size="small" style={{ whiteSpace: 'nowrap' }}>
                    {patient.submissions.geburtsdatum
                        ? calculateAge(patient.submissions.geburtsdatum)
                        : 'Kein Geburtsdatum'
                    }
                </Text>
            ),
        },
        {
            title: (
                <Box direction="horizontal" gap="SP1" align="center">
                    <Text>HB</Text>
                </Box>
            ),
            width: '8%',
            minWidth: '80px',
            render: (patient: PatientSubmission) => (
                <Badge
                    skin={patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'success' : 'neutralLight'}
                    size="small"
                >
                    {patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'Ja' : 'Nein'}
                </Badge>
            ),
        },
        {
            title: (
                <Box direction="horizontal" gap="SP1" align="center">
                    <Text>WV</Text>
                </Box>
            ),
            width: '8%',
            minWidth: '100px',
            render: (patient: PatientSubmission) => (
                <Badge
                    skin={patient.submissions.waren_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'success' : 'standard'}
                    size="small"
                >
                    {patient.submissions.waren_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'Neu' : 'WV'}
                </Badge>
            ),
        },
        {
            title: 'K/E',
            width: '10%',
            minWidth: '140px',
            render: (patient: PatientSubmission) => {
                if (!patient.submissions.geburtsdatum) return <Text>-</Text>;

                const today = new Date();
                const birth = new Date(patient.submissions.geburtsdatum);
                let age = today.getFullYear() - birth.getFullYear();
                const monthDiff = today.getMonth() - birth.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                    age--;
                }

                return (
                    <Badge
                        skin={age <= 18 ? 'standard' : 'premium'}
                        size="small"
                    >
                        {age <= 18 ? 'Kinder' : 'Erwachsene'}
                    </Badge>
                );
            },
        },

        {
            title: '',
            width: '120px',
            render: (patient: PatientSubmission) => {
                const note = notes[patient._id];
                const hasNote = note && note.notes && note.notes.trim() !== '';

                return (
                    <TableActionCell
                        secondaryActions={[
                            {
                                text: 'Vorschau',
                                icon: <Icons.Visible />,
                                onClick: () => {
                                    console.log('Vorschau clicked', patient);
                                    onViewPatient(patient);
                                }
                            },
                            {
                                text: 'Drucken',
                                icon: <Icons.Print />,
                                onClick: () => onPrintPatient(patient)
                            },
                            {
                                text: hasNote ? 'Notiz bearbeiten' : 'Notiz hinzufügen',
                                icon: hasNote ? <Icons.Edit /> : <Icons.Add />,
                                onClick: () => toggleNoteExpansion(patient._id)
                            },
                            {
                                text: 'Bearbeiten',
                                icon: <Icons.Edit />,
                                onClick: () => console.log('Edit', patient._id)
                            },
                            {
                                text: 'Löschen',
                                icon: <Icons.Delete />,
                                onClick: () => onDeletePatient(patient._id),
                                skin: 'destructive'
                            }
                        ]}
                        numOfVisibleSecondaryActions={0}
                    />
                );
            },
        },
    ];

    if (patients.length === 0) {
        return (
            <Box padding="40px" textAlign="center">
                <Text size="medium">Keine Patienten gefunden</Text>
            </Box>
        );
    }

    // Load notes for visible patients
    useEffect(() => {
        currentPatients.forEach(patient => {
            const email = patient.submissions.email_726a?.trim() || '';
            const name = `${patient.submissions.vorname || ''} ${patient.submissions.name_1 || ''}`.trim();
            loadNoteForSubmission(patient._id, email, name);
        });
    }, [currentPatients, loadNoteForSubmission]);

    return (
        <Box direction="vertical" gap="SP4">
            {/* Integrated Table with Toolbar */}
            <Box
                style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <style>{`
                    .patient-table-container table tbody tr {
                        transition: background-color 0.15s ease;
                    }
                    .patient-table-container table tbody tr:hover {
                        background-color: rgba(59, 130, 246, 0.08) !important;
                    }
                    .patient-table-container table tbody tr:hover td {
                        background-color: transparent !important;
                    }
                    
                    .table-row-hover:hover {
                        background-color: rgba(59, 130, 246, 0.08) !important;
                    }
                    
                    /* Ensure table has a minimum width */
                    table { min-width: 900px !important; }
                `}</style>
                <Box>
                    <Table
                        data={currentPatients}
                        columns={columns}
                        onSortClick={(column) => {
                            handleSort('date');
                        }}
                        withWrapper={false}
                    >
                        <Card>
                            <TableToolbar>
                                <TableToolbar.ItemGroup position="start">
                                    <TableToolbar.Item>
                                        <Text size="medium" weight="normal">
                                            {filteredPatients.length} von {totalPatients} Patienten
                                        </Text>
                                    </TableToolbar.Item>
                                    {searchTerm && (
                                        <TableToolbar.Item>
                                            <TableToolbar.Label>
                                                Gefiltert nach: "{searchTerm}"
                                            </TableToolbar.Label>
                                        </TableToolbar.Item>
                                    )}
                                </TableToolbar.ItemGroup>
                                <TableToolbar.ItemGroup position="end">
                                    <TableToolbar.Item>
                                        <Box width="300">
                                            <Search
                                                value={searchTerm}
                                                onChange={(e) => onSearchChange(e.target.value)}
                                                placeholder="Nach Namen suchen..."
                                                size="small"
                                            />
                                        </Box>
                                    </TableToolbar.Item>
                                </TableToolbar.ItemGroup>
                            </TableToolbar>
                            <Box style={{ flex: 1, overflow: 'visible' }}>
                                <Table.Content />
                            </Box>
                        </Card>
                    </Table>
                </Box>
            </Box>

            {totalPages > 1 && (
                <Box
                    direction="vertical"
                    gap="SP1"
                    align="center"


                >
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onChange={(event) => {
                            setIsChangingPage(true);
                            setCurrentPage(event.page);
                            // Reset loading after a brief moment to show visual feedback
                            setTimeout(() => setIsChangingPage(false), 100);
                        }}
                    />
                    <Box textAlign="center">
                        <Text size="small">
                            Zeige {startIndex + 1} bis {endIndex} von {filteredPatients.length} Patienten
                            {searchTerm && ` (gefiltert von ${totalPatients} gesamt)`}
                        </Text>
                    </Box>
                </Box>
            )}

            {totalPages <= 1 && (
                <Box textAlign="center" padding="16px 0">
                    <Text size="small">
                        Zeige alle {patients.length} Patienten
                    </Text>
                </Box>
            )}
        </Box>
    );
};
