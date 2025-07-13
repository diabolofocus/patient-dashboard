
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
        <Box direction="horizontal" gap="SP4">
            <Card>
                <Card.Header title="Patienten Insgesamt" />
                <Card.Content>
                    <Text size="medium" weight="bold">
                        {totalPatients} Patienten
                    </Text>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header title="Wartelistendauer" />
                <Card.Content>
                    <Text size="medium" weight="bold">
                        {waitingTime.months} Monate
                    </Text>
                    <Text size="medium">
                        {waitingTime.days} Tage
                    </Text>
                </Card.Content>
            </Card>

            <Card>
                <Card.Header title="Altersverteilung" />
                <Card.Content>
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
                </Card.Content>
            </Card>

            <Card>
                <Card.Header title="Geschlechterverteilung" />
                <Card.Content>
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
                </Card.Content>
            </Card>

            <Card>
                <Card.Header title={currentDate} />
                <Card.Content>
                    <Text size="medium" weight="bold">
                        {currentTime}
                    </Text>
                </Card.Content>
            </Card>
        </Box>
    );
};