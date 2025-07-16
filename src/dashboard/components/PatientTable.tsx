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
    IconButton,
    TableListHeader,
    TextButton
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
    const [editingNotes, setEditingNotes] = useState<{ [submissionId: string]: boolean }>({});


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

    // Handle sort change from TableListHeader
    const handleSortChange = (colNum: number) => {
        // Only column 1 (Date) is sortable
        if (colNum === 1) {
            handleSort('date');
        }
    };

    const headerOptions = [
        {
            value: '\u00A0\u00A0\u00A0\u00A0Name', // Non-breaking spaces to align with avatar
            width: '236px', // 220px + 16px gap compensation
            align: 'left' as const,

        },
        {
            value: `Datum (${sortField === 'date' && sortOrder === 'desc' ? 'Neueste' : 'Älteste'})`,
            width: '136px', // 120px + 16px gap compensation
            align: 'left' as const,
            sortable: true,
            sortDescending: sortField === 'date' ? sortOrder === 'desc' : undefined,
        },
        {
            value: 'Alter',
            width: '136px', // 120px + 16px gap compensation
            align: 'left' as const,
        },
        {
            value: 'Ort',
            width: '100px', // 70px + 16px gap compensation
            align: 'left' as const,
        },
        {
            value: 'WV',
            width: '100px', // 70px + 16px gap compensation
            align: 'left' as const,
        },
        {
            value: 'K/E',
            width: '106px', // 70px + 16px gap compensation
            align: 'left' as const,
        },
        {
            value: '',
            width: '116px', // 60px + 16px gap compensation
            align: 'left' as const,
        },
    ];

    if (patients.length === 0) {
        return (
            <Box padding="40px" textAlign="center">
                <Text size="medium">Keine Patienten gefunden</Text>
            </Box>
        );
    }

    // Load notes for visible patients (this should still be there)
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
                    flexDirection: 'column',
                    overflowX: 'auto',
                    minWidth: '100%'
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
    
    /* Force TableListHeader to full width and proper alignment */
    [data-hook="table-list-header"] {
        width: 100% !important;
        min-width: 100% !important;
        display: flex !important;
        padding: 12px 16px !important;
        box-sizing: border-box !important;
    }
    
    [data-hook="table-list-header"] > div {
        display: flex !important;
        width: 100% !important;
    }
    
    /* Ensure proper column spacing */
    [data-hook="table-list-header"] [data-hook="table-list-header-cell"] {
        margin-right: 16px !important;
    }
    
    [data-hook="table-list-header"] [data-hook="table-list-header-cell"]:last-child {
        margin-right: 0 !important;
    }
    
    /* Horizontal scroll styling */
    .table-container {
        overflow-x: auto;
        min-width: 100%;
    }
    
    /* Ensure table has a minimum width */
    table { min-width: 1000px !important; }
    
    /* Custom scrollbar styling */
    .table-container::-webkit-scrollbar {
        height: 8px;
    }
    
    .table-container::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    .table-container::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    
    .table-container::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
  
    
    .note-input-container input {
        width: 657px !important;
        min-width: 657px !important;
    }

    /* Add this to your existing styles */
  .modal-content table {
    max-width: 100% !important;
    table-layout: fixed;
    word-wrap: break-word;
  }
  
  .modal-content td {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
`}</style>
                <Card>
                    <TableToolbar>
                        <TableToolbar.ItemGroup position="start">
                            <TableToolbar.Item>
                                <Text size="medium" weight="normal">
                                    {filteredPatients.length !== totalPatients
                                        ? `${filteredPatients.length} von ${totalPatients} Patienten`
                                        : `${totalPatients} Patienten`
                                    }
                                </Text>
                            </TableToolbar.Item>
                            {/* {searchTerm && (
                                <TableToolbar.Item>
                                    <TableToolbar.Label>
                                        Gefiltert nach: "{searchTerm}"
                                    </TableToolbar.Label>
                                </TableToolbar.Item>
                            )} */}
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

                    {/* Custom table structure with expandable note rows */}
                    <Box
                        direction="vertical"
                        style={{
                            overflowX: 'auto',
                            minWidth: '730px' // Updated minimum width for all columns
                        }}
                    >
                        {/* Table Header using TableListHeader */}
                        <Box
                            style={{
                                width: '100%',
                                minWidth: '730px'
                            }}
                        >
                            <TableListHeader
                                options={headerOptions}
                                onSortChange={handleSortChange}
                                checkboxState="hidden"
                            />
                        </Box>

                        {/* Table Rows */}
                        <Box direction="vertical">
                            {currentPatients.map((patient, index) => {
                                const note = notes[patient._id];

                                const hasNote = note && note.notes && note.notes.trim() !== '';

                                // Calculate age
                                let age = 0;
                                if (patient.submissions.geburtsdatum) {
                                    const today = new Date();
                                    const birth = new Date(patient.submissions.geburtsdatum);
                                    age = today.getFullYear() - birth.getFullYear();
                                    const monthDiff = today.getMonth() - birth.getMonth();
                                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                                        age--;
                                    }
                                }

                                return (
                                    <Box key={patient._id} direction="vertical">
                                        {/* Main Patient Row */}
                                        {/* Main Patient Row */}
                                        <div
                                            onClick={() => onViewPatient(patient)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <Box
                                                direction="horizontal"
                                                gap="SP2"
                                                padding="16px"
                                                backgroundColor="#FFFFFF"
                                                style={{
                                                    alignItems: 'center',
                                                    minHeight: '56px',
                                                    transition: 'background-color 0.15s ease',
                                                    borderBottom: (note?.notes && note.notes.trim() !== '') ? 'none' : '1px solid #EAEAEA'
                                                }}
                                                className="table-row-hover"
                                            >
                                                {/* Name Column */}
                                                <Box width="220px" minWidth="220px" direction="horizontal" gap="SP2" align="left" style={{ alignItems: 'center' }}>
                                                    <Avatar size="size24" />
                                                    <Text size="small">
                                                        {`${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.trim()}
                                                    </Text>
                                                </Box>

                                                {/* Date Column */}
                                                <Box width="120px" minWidth="120px">
                                                    <Text size="small">
                                                        {formatToGermanDate(patient.submissions.date_5bd8 || patient._createdDate)}
                                                    </Text>
                                                </Box>

                                                {/* Age Column */}
                                                <Box width="120px" minWidth="120px">
                                                    <Text size="small" style={{ whiteSpace: 'nowrap' }}>
                                                        {patient.submissions.geburtsdatum
                                                            ? calculateAge(patient.submissions.geburtsdatum)
                                                            : 'Kein Geburtsdatum'
                                                        }
                                                    </Text>
                                                </Box>

                                                {/* HB Column */}
                                                <Box width="90px" minWidth="90px">
                                                    <Badge
                                                        skin={patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'success' : 'neutralLight'}
                                                        size="small"
                                                    >
                                                        {patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'HAUS' : 'PRAXIS'}
                                                    </Badge>
                                                </Box>

                                                {/* WV Column */}
                                                <Box width="90px" minWidth="90px">
                                                    <Badge
                                                        skin={patient.submissions.waren_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'neutralLight' : 'success'}
                                                        size="small"
                                                    >
                                                        {patient.submissions.waren_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'NA' : 'WV'}
                                                    </Badge>
                                                </Box>

                                                {/* K/E Column */}
                                                <Box width="90px" minWidth="90px">
                                                    {!patient.submissions.geburtsdatum ? (
                                                        <Text>-</Text>
                                                    ) : (
                                                        <Badge
                                                            skin={age <= 18 ? 'standard' : 'premium'}
                                                            size="small"
                                                        >
                                                            {age <= 18 ? 'Kinder' : 'Erwachsene'}
                                                        </Badge>
                                                    )}
                                                </Box>

                                                {/* Actions Column */}
                                                <Box width="90px" minWidth="90px" direction="horizontal" align="right" alignContent="end">
                                                    <PopoverMenu
                                                        textSize="small"
                                                        triggerElement={
                                                            <IconButton
                                                                skin="inverted"
                                                                size="small"
                                                            >
                                                                <Icons.More />
                                                            </IconButton>
                                                        }
                                                        placement="top"
                                                    >
                                                        <PopoverMenu.MenuItem
                                                            text="Vorschau"
                                                            onClick={() => onViewPatient(patient)}
                                                            prefixIcon={<Icons.Visible />}
                                                        />
                                                        <PopoverMenu.MenuItem
                                                            text="Drucken"
                                                            onClick={() => onPrintPatient(patient)}
                                                            prefixIcon={<Icons.Print />}
                                                        />
                                                        <PopoverMenu.MenuItem
                                                            text="Notiz hinzufügen"
                                                            onClick={() => {
                                                                // Set editing mode to true
                                                                setEditingNotes(prev => ({ ...prev, [patient._id]: true }));

                                                                // Create empty note structure if it doesn't exist
                                                                if (!notes[patient._id]) {
                                                                    const email = patient.submissions.email_726a?.trim() || '';
                                                                    const name = `${patient.submissions.vorname || ''} ${patient.submissions.name_1 || ''}`.trim();
                                                                    loadNoteForSubmission(patient._id, email, name);
                                                                }
                                                            }}
                                                            prefixIcon={<Icons.Add />}
                                                        />
                                                        <PopoverMenu.Divider />
                                                        <PopoverMenu.MenuItem
                                                            text="Löschen"
                                                            onClick={() => onDeletePatient(patient._id)}
                                                            prefixIcon={<Icons.Delete />}
                                                            skin="destructive"
                                                        />
                                                    </PopoverMenu>
                                                </Box>
                                            </Box>
                                        </div>

                                        {/* Note Row - Show if note has content OR if we're editing */}
                                        {((note?.notes && note.notes.trim() !== '') || editingNotes[patient._id]) && (
                                            <Box
                                                padding="12px 16px 12px 16px"
                                                backgroundColor="#fff"
                                                borderBottom="1px solid #EAEAEA"
                                                style={{
                                                    borderTop: '1px dashed #CCCCCC'
                                                }}
                                            >
                                                <Box className="note-input-container">
                                                    <Input
                                                        prefix={
                                                            <Input.IconAffix>
                                                                <Icons.Comment />
                                                            </Input.IconAffix>
                                                        }
                                                        suffix={
                                                            <Input.IconAffix>
                                                                {editingNotes[patient._id] ? (
                                                                    <Box direction="horizontal" gap="SP1">
                                                                        <TextButton
                                                                            size="tiny"
                                                                            skin="destructive"
                                                                            onClick={() => {
                                                                                setEditingNotes(prev => ({ ...prev, [patient._id]: false }));
                                                                                // Reset the note text to original value
                                                                                const email = patient.submissions.email_726a?.trim() || '';
                                                                                const name = `${patient.submissions.vorname || ''} ${patient.submissions.name_1 || ''}`.trim();
                                                                                loadNoteForSubmission(patient._id, email, name);
                                                                            }}
                                                                        >
                                                                            Abbrechen
                                                                        </TextButton>
                                                                        <TextButton
                                                                            size="tiny"
                                                                            onClick={async () => {
                                                                                const success = await saveNote(patient._id, note.notes);
                                                                                if (success) {
                                                                                    setEditingNotes(prev => ({ ...prev, [patient._id]: false }));
                                                                                }
                                                                            }}
                                                                            disabled={loadingNotes[patient._id]}
                                                                        >
                                                                            {loadingNotes[patient._id] ? 'Speichern...' : 'Speichern'}
                                                                        </TextButton>

                                                                    </Box>
                                                                ) : (
                                                                    <TextButton
                                                                        size="tiny"
                                                                        onClick={() => {
                                                                            setEditingNotes(prev => ({ ...prev, [patient._id]: true }));
                                                                        }}
                                                                    >
                                                                        Bearbeiten
                                                                    </TextButton>
                                                                )}
                                                            </Input.IconAffix>
                                                        }
                                                        value={note.notes}
                                                        readOnly={!editingNotes[patient._id]}
                                                        size="small"
                                                        onChange={(e) => {
                                                            if (editingNotes[patient._id]) {
                                                                updateNoteText(patient._id, e.target.value);
                                                            }
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && editingNotes[patient._id]) {
                                                                // Save on Enter
                                                                saveNote(patient._id, note.notes).then((success) => {
                                                                    if (success) {
                                                                        setEditingNotes(prev => ({ ...prev, [patient._id]: false }));
                                                                    }
                                                                });
                                                            }
                                                            if (e.key === 'Escape' && editingNotes[patient._id]) {
                                                                // Cancel on Escape
                                                                setEditingNotes(prev => ({ ...prev, [patient._id]: false }));
                                                                const email = patient.submissions.email_726a?.trim() || '';
                                                                const name = `${patient.submissions.vorname || ''} ${patient.submissions.name_1 || ''}`.trim();
                                                                loadNoteForSubmission(patient._id, email, name);
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    </Box>
                </Card>
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
                <Box align="center">
                    <Text size="small">
                        Zeige alle {patients.length} Patienten
                    </Text>
                </Box>
            )}
        </Box>
    );
};
