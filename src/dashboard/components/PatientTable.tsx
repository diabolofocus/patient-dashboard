// ==============================================
// FIXED: PatientTable.tsx - Corrected Pagination Props
// ==============================================

import React, { useState } from 'react';
import {
    Table,
    Button,
    Text,
    Avatar,
    Badge,
    Pagination,
    PopoverMenu,
    Box
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
}

const ITEMS_PER_PAGE = 20;

export const PatientTable: React.FC<PatientTableProps> = ({
    patients,
    onViewPatient,
    onPrintPatient,
    onDeletePatient,
    onUpdatePatientStatus,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<string>('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const totalPages = Math.ceil(patients.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, patients.length);

    // Sort patients
    const sortedPatients = [...patients].sort((a, b) => {
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
            render: (patient: PatientSubmission) => (
                <Box direction="horizontal" gap="SP2" align="center">
                    <Avatar size="size30" />
                    <Text>{`${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.trim()}</Text>
                </Box>
            ),
        },
        {
            title: `Datum (${sortOrder === 'desc' ? 'Neueste' : 'Älteste'})`,
            render: (patient: PatientSubmission) => (
                <Text>
                    {formatToGermanDate(patient.submissions.date_5bd8 || patient._createdDate)}
                </Text>
            ),
        },
        {
            title: 'HB',
            render: (patient: PatientSubmission) => (
                <Badge
                    skin={patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'success' : 'general'}
                    size="small"
                >
                    {patient.submissions.wurde_ein_hausbesuch_verordnet === 'Ja' ? 'Ja' : 'Nein'}
                </Badge>
            ),
        },
        {
            title: 'WV',
            render: (patient: PatientSubmission) => (
                <Badge
                    skin={patient.submissions.wurden_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'success' : 'warning'}
                    size="small"
                >
                    {patient.submissions.wurden_sie_schon_einmal_bei_uns_in_behandlung === 'Nein' ? 'Neu' : 'Alt'}
                </Badge>
            ),
        },
        {
            title: 'K/E',
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
            title: 'Alter',
            render: (patient: PatientSubmission) => (
                <Box
                    padding="8px"
                    backgroundColor={getAgeColor(patient.submissions.geburtsdatum || '')}
                    borderRadius="4px"
                >
                    <Text size="small">
                        {patient.submissions.geburtsdatum
                            ? calculateAge(patient.submissions.geburtsdatum)
                            : 'Kein Geburtsdatum'
                        }
                    </Text>
                </Box>
            ),
        },
        {
            title: '',
            width: '200px',
            render: (patient: PatientSubmission) => (
                <Box direction="horizontal" gap="SP2">
                    <Button
                        priority="secondary"
                        size="small"
                        prefixIcon={<Icons.Visible />}
                        onClick={() => onViewPatient(patient)}
                    >
                        Vorschau
                    </Button>
                    <Button
                        priority="secondary"
                        size="small"
                        prefixIcon={<Icons.Print />}
                        onClick={() => onPrintPatient(patient)}
                    >
                        Drucken
                    </Button>
                    <PopoverMenu
                        triggerElement={
                            <Button
                                priority="secondary"
                                size="small"
                                prefixIcon={<Icons.More />}
                            />
                        }
                    >
                        <PopoverMenu.MenuItem
                            text="Notiz hinzufügen"
                            prefixIcon={<Icons.Add />}
                        />
                        <PopoverMenu.MenuItem
                            text="Datum bearbeiten"
                            prefixIcon={<Icons.Edit />}
                        />
                        <PopoverMenu.MenuItem
                            text="Löschen"
                            prefixIcon={<Icons.Delete />}
                            onClick={() => onDeletePatient(patient._id)}
                            skin="destructive"
                        />
                    </PopoverMenu>
                </Box>
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
            <Table
                data={currentPatients}
                columns={columns}
                onSortClick={(columnData) => {
                    if (typeof columnData.title === 'string') {
                        handleSort(columnData.title.toLowerCase());
                    }
                }}
            />

            {totalPages > 1 && (
                <Box textAlign="center">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onChange={(event) => setCurrentPage(event.page)}
                    />
                </Box>
            )}

            <Box textAlign="center">
                <Text size="small">
                    Zeige {startIndex + 1} bis {endIndex} von {patients.length} Patienten
                </Text>
            </Box>
        </Box>
    );
};
