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
    TableActionCell
} from '@wix/design-system';
import * as Icons from '@wix/wix-ui-icons-common';
import { PatientSubmission } from '../types';
import { formatToGermanDate, calculateAge } from '../utils/helpers';


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

const ITEMS_PER_PAGE = 50;

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

    const getAgeColor = (birthDate: string): string => {
        if (!birthDate) return '#CCCCCC';

        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        if (age <= 18) return '#C8DEFD';
        if (age <= 120) return '#0D52BF';
        return '#F0F0F0';
    };
    const columns = [
        {
            title: 'Name',
            width: '30%',  // Make name column wider
            render: (patient: PatientSubmission) => (
                <Box direction="horizontal" gap="SP2" style={{ alignItems: 'center' }}>
                    <Avatar size="size24" />
                    <Text size="small">{`${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.trim()}</Text>
                </Box>
            ),
        },
        {
            title: `Datum (${sortField === 'date' && sortOrder === 'desc' ? 'Neueste' : 'Älteste'})`,
            width: '15%',
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
            width: '17%',
            render: (patient: PatientSubmission) => (
                <Text size="small">
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
            render: (patient: PatientSubmission) => (
                <Badge
                    skin={patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'success' : 'neutralOutlined'}
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
            render: (patient: PatientSubmission) => (
                <Badge
                    skin={patient.submissions.wurden_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'success' : 'standard'}
                    size="small"
                >
                    {patient.submissions.wurden_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'Neu' : 'Alt'}
                </Badge>
            ),
        },
        {
            title: 'K/E',
            width: '8%',
            render: (patient: PatientSubmission) => {
                if (!patient.submissions.geburtsdatum) return <Text>-</Text>;

                const today = new Date();
                const birth = new Date(patient.submissions.geburtsdatum);
                let age = today.getFullYear() - birth.getFullYear();

                return (
                    <Badge
                        skin={age <= 18 ? 'standard' : 'premium'}
                        size="small"
                    >
                        {age <= 18 ? 'K' : 'E'}
                    </Badge>
                );
            },
        },
        {
            title: '',
            width: '120px',
            render: (patient: PatientSubmission) => (
                <TableActionCell
                    secondaryActions={[
                        {
                            text: 'Vorschau',
                            icon: <Icons.Visible />,
                            onClick: () => onViewPatient(patient)
                        },
                        {
                            text: 'Drucken',
                            icon: <Icons.Print />,
                            onClick: () => onPrintPatient(patient)
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
            ),
        },
    ];

    if (patients.length === 0) {
        return (
            <Box padding="40px" textAlign="center">
                <Text size="medium">Keine Patienten gefunden</Text>
            </Box>
        );
    }

    return (
        <Box direction="vertical" gap="SP4">
            {/* Integrated Table with Toolbar */}
            <Box
                style={{
                    height: 'calc(100vh - 300px)',
                    maxHeight: 'calc(100vh - 300px)',
                    overflowY: 'auto',
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
                `}</style>
                <Box style={{ height: '100%', overflow: 'visible' }}>
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
                            <Box style={{ flex: 1, overflow: 'auto' }}>
                                <Table.Content />
                            </Box>
                        </Card>
                    </Table>
                </Box>
            </Box>

            {totalPages > 1 && (
                <Box
                    direction="horizontal"
                    gap="SP4"
                    align="center"

                    padding="16px 0"
                >
                    <Box textAlign="center">
                        <Text size="small">
                            Zeige {startIndex + 1} bis {endIndex} von {filteredPatients.length} Patienten
                            {searchTerm && ` (gefiltert von ${totalPatients} gesamt)`}
                        </Text>
                    </Box>
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
