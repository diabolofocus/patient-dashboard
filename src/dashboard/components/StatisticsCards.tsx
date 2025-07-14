
// ==============================================
// FIXED: 8. src/dashboard/pages/components/StatisticsCards.tsx
// ==============================================

import React from 'react';
import { Card, Text, Box } from '@wix/design-system';
import { PatientSubmission, AgeGroups, GenderGroups, WaitingTime } from '../types';

interface StatisticsCardsProps {
    totalPatients: number;
    waitingTime: WaitingTime;
    ageGroups: AgeGroups;
    genderGroups: GenderGroups;
    currentTime: string;
    currentDate: string;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
    totalPatients,
    waitingTime,
    ageGroups,
    genderGroups,
    currentTime,
    currentDate,
}) => {
    return (
        <Box>
            <Card>
                <Card.Content>
                    <Box direction="horizontal" gap="SP6" align="center" width="1200px">
                        {/* Patienten Insgesamt */}
                        <Box direction="vertical" flexGrow={1}>
                            <Text size="tiny" weight="bold" color="secondary">Patienten Insgesamt</Text>
                            <Text size="medium" weight="bold">{totalPatients} Patienten</Text>
                        </Box>
                        {/* Wartelistendauer */}
                        <Box direction="vertical" flexGrow={1}>
                            <Text size="tiny" weight="bold" color="secondary">Wartelistendauer</Text>
                            <Text size="medium" weight="bold">{waitingTime.months} Monate</Text>
                            <Text size="medium">{waitingTime.days} Tage</Text>
                        </Box>
                        {/* Altersverteilung */}
                        <Box direction="vertical" flexGrow={2} minWidth={170}>
                            <Text size="tiny" weight="bold" color="secondary">Altersverteilung</Text>
                            <Box direction="vertical" gap="SP1">
                                <Box direction="horizontal" gap="SP2" align="center">
                                    <Box width="12px" height="12px" backgroundColor="#C8DEFD" borderRadius="50%" />
                                    <Text size="small">Kinder (0-12): {ageGroups.kids}</Text>
                                </Box>
                                <Box direction="horizontal" gap="SP2" align="center">
                                    <Box width="12px" height="12px" backgroundColor="#5093FF" borderRadius="50%" />
                                    <Text size="small">Jugendliche (13-17): {ageGroups.teenagers}</Text>
                                </Box>
                                <Box direction="horizontal" gap="SP2" align="center">
                                    <Box width="12px" height="12px" backgroundColor="#0D52BF" borderRadius="50%" />
                                    <Text size="small">Erwachsene (18+): {ageGroups.adults}</Text>
                                </Box>
                            </Box>
                        </Box>
                        {/* Geschlechterverteilung */}
                        <Box direction="vertical" flexGrow={2} minWidth={170}>
                            <Text size="tiny" weight="bold" color="secondary">Geschlechterverteilung</Text>
                            <Box direction="vertical" gap="SP1">
                                <Box direction="horizontal" gap="SP2" align="center">
                                    <Box width="12px" height="12px" backgroundColor="#3899EC" borderRadius="50%" />
                                    <Text size="small">Männlich: {genderGroups.men}</Text>
                                </Box>
                                <Box direction="horizontal" gap="SP2" align="center">
                                    <Box width="12px" height="12px" backgroundColor="#D946EF" borderRadius="50%" />
                                    <Text size="small">Weiblich: {genderGroups.women}</Text>
                                </Box>
                                <Box direction="horizontal" gap="SP2" align="center">
                                    <Box width="12px" height="12px" backgroundColor="#10B981" borderRadius="50%" />
                                    <Text size="small">Divers: {genderGroups.divers}</Text>
                                </Box>
                            </Box>
                        </Box>
                        {/* Datum/Uhrzeit */}
                        <Box direction="vertical" flexGrow={1} minWidth={100} align="right">
                            <Text size="tiny" weight="bold" color="secondary">{currentDate}</Text>
                            <Text size="medium" weight="bold">{currentTime}</Text>
                        </Box>
                    </Box>
                </Card.Content>
            </Card>
        </Box>
    );
};