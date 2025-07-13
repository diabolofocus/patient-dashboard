// Update: src/dashboard/pages/patienten/page.tsx
// Fixed layout to match the desired vertical design

import React, { useState, useEffect, useMemo } from 'react';
import {
  Page,
  WixDesignSystemProvider,
  Button,
  Box,
  Loader,
  MessageModalLayout,
  Text
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { dashboard } from '@wix/dashboard';

// Import components when ready
// import { usePatientData } from '../hooks/usePatientData';
// import { useFilters } from '../hooks/useFilters';
// import { StatisticsCards } from '../components/StatisticsCards';
// import { SearchBar } from '../components/SearchBar';
// import { FilterPanel } from '../components/FilterPanel';
// import { PatientTable } from '../components/PatientTable';
// import { PatientSubmission } from '../types';
// import { calculateWaitingTime } from '../utils/helpers';

import styles from './styles/dashboard.module.css';

const PatientDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const berlinTime = now.toLocaleTimeString('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const berlinDate = now.toLocaleDateString('de-DE', {
        timeZone: 'Europe/Berlin',
        day: 'numeric',
        month: 'long'
      });

      setCurrentTime(berlinTime);
      setCurrentDate(berlinDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleRefresh = () => {
    dashboard.showToast({
      message: 'Daten werden aktualisiert...',
      type: 'success',
    });
  };

  const handleAddNewRegistration = () => {
    window.open('https://www.xn--logopdie-falkensee-ptb.de/anmeldung', '_blank');
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header
          title="Patientenliste"
          subtitle="Verwalten Sie Ihre Patienteneinreichungen und Wartelisten"
          actionsBar={
            <Box direction="horizontal" gap="SP3">
              <Button
                onClick={handleRefresh}
                prefixIcon={<Icons.Refresh />}
                priority="secondary"
              >
                Aktualisieren
              </Button>
              <Button
                onClick={handleAddNewRegistration}
                prefixIcon={<Icons.Add />}
              >
                Neue Einreichung Hinzufügen
              </Button>
            </Box>
          }
        />

        <Page.Content>
          <Box direction="vertical" className={styles.dashboard}>

            {/* Statistics Cards Section - Horizontal at top */}
            <Box className={styles.statisticsSection}>
              <Box direction="horizontal" gap="SP4" >
                {/* Patient Total Card */}
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                  minWidth="200px"
                  flexGrow={1}
                >
                  <Text size="small" color="gray">Patienten Insgesamt</Text>
                  <Text size="medium" weight="bold">77 Patienten</Text>
                </Box>

                {/* Waiting Time Card */}
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                  minWidth="200px"
                  flexGrow={1}
                >
                  <Text size="small" color="gray">Wartelistendauer</Text>
                  <Text size="medium" weight="bold">7 Monate</Text>
                  <Text size="medium">23 Tage</Text>
                </Box>

                {/* Age Distribution Card */}
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                  minWidth="200px"
                  flexGrow={1}
                >
                  <Text size="small" color="gray">Altersverteilung</Text>
                  <Box direction="vertical" gap="SP1" marginTop="SP2">
                    <Box direction="horizontal" gap="SP2" align="center">
                      <Box width="12px" height="12px" backgroundColor="#C8DEFD" borderRadius="50%" />
                      <Text size="small">Kinder (0-12): 65</Text>
                    </Box>
                    <Box direction="horizontal" gap="SP2" align="center">
                      <Box width="12px" height="12px" backgroundColor="#5093FF" borderRadius="50%" />
                      <Text size="small">Jugendliche (13-17): 6</Text>
                    </Box>
                    <Box direction="horizontal" gap="SP2" align="center">
                      <Box width="12px" height="12px" backgroundColor="#0D52BF" borderRadius="50%" />
                      <Text size="small">Erwachsene (18+): 6</Text>
                    </Box>
                  </Box>
                </Box>

                {/* Gender Distribution Card */}
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                  minWidth="200px"
                  flexGrow={1}
                >
                  <Text size="small" color="gray">Geschlechterverteilung</Text>
                  <Box direction="vertical" gap="SP1" marginTop="SP2">
                    <Box direction="horizontal" gap="SP2" align="center">
                      <Box width="12px" height="12px" backgroundColor="#3899EC" borderRadius="50%" />
                      <Text size="small">Männlich: 39</Text>
                    </Box>
                    <Box direction="horizontal" gap="SP2" align="center">
                      <Box width="12px" height="12px" backgroundColor="#D946EF" borderRadius="50%" />
                      <Text size="small">Weiblich: 38</Text>
                    </Box>
                    <Box direction="horizontal" gap="SP2" align="center">
                      <Box width="12px" height="12px" backgroundColor="#10B981" borderRadius="50%" />
                      <Text size="small">Divers: 0</Text>
                    </Box>
                  </Box>
                </Box>

                {/* Time Card */}
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                  minWidth="200px"
                  flexGrow={1}
                >
                  <Text size="small" color="gray">{currentDate}</Text>
                  <Text size="medium" weight="bold">{currentTime}</Text>
                </Box>
              </Box>
            </Box>

            {/* Main Content Layout - Table (left) + Filters (right) */}
            <Box className={styles.contentLayout}>

              {/* Main Content Area - Left Side */}
              <Box className={styles.mainContent}>

                {/* Search Section */}
                <Box className={styles.searchSection}>
                  <Box direction="horizontal" gap="SP4" align="center">
                    <Box flexGrow={1}>
                      <Box
                        padding="12px 16px"
                        borderRadius="6px"
                        border="1px solid #d4edda"
                        backgroundColor="#f8f9fa"
                      >
                        <Text color="gray">🔍 Suchen..</Text>
                      </Box>
                    </Box>
                    <Box direction="horizontal" gap="SP3" align="center">
                      <Text>77 Patienten</Text>
                      <Button
                        onClick={handleRefresh}
                        prefixIcon={<Icons.Refresh />}
                        priority="secondary"
                        size="medium"
                      >
                        Aktualisieren
                      </Button>
                    </Box>
                  </Box>
                </Box>

                {/* Patient Table Section */}
                <Box className={styles.tableSection}>
                  <Box direction="vertical" gap="SP4">
                    <Text size="medium" weight="bold">77 Patienten</Text>

                    {/* Table Header */}
                    <Box
                      direction="horizontal"
                      gap="SP4"
                      padding="12px 16px"
                      backgroundColor="#f8f9fa"
                      borderRadius="6px"
                    >
                      <Box flexGrow={2}><Text size="small" weight="bold">Name</Text></Box>
                      <Box flexGrow={1}><Text size="small" weight="bold">Datum (Neueste)</Text></Box>
                      <Box width="60px"><Text size="small" weight="bold">HB</Text></Box>
                      <Box width="60px"><Text size="small" weight="bold">WV</Text></Box>
                      <Box width="60px"><Text size="small" weight="bold">K/E</Text></Box>
                      <Box flexGrow={1}><Text size="small" weight="bold">Alter</Text></Box>
                      <Box width="200px"></Box>
                    </Box>

                    {/* Sample Patient Rows */}
                    {[
                      { name: "Kurdic Mayson Ryan", date: "13.07.2025", age: "6 Jahre, 9 Mo" },
                      { name: "Bertsch Johannes Emil", date: "11.07.2025", age: "2 Jahre, 12 Mo" },
                      { name: "Schwarz Finja", date: "10.07.2025", age: "8 Jahre, 1 Mo" },
                      { name: "Dikow Valentin", date: "07.07.2025", age: "4 Jahre, 1 Mo" },
                      { name: "Dikow Emily", date: "07.07.2025", age: "4 Jahre, 1 Mo" },
                    ].map((patient, index) => (
                      <Box
                        key={index}
                        direction="horizontal"
                        gap="SP4"
                        padding="12px 16px"
                        borderBottom="1px solid #e0e0e0"
                        align="center"
                      >
                        <Box direction="horizontal" gap="SP2" align="center" flexGrow={2}>
                          <Box
                            width="32px"
                            height="32px"
                            backgroundColor="#e0e0e0"
                            borderRadius="50%"
                          />
                          <Text>{patient.name}</Text>
                        </Box>
                        <Box flexGrow={1}><Text>{patient.date}</Text></Box>
                        <Box width="60px">
                          <Box padding="4px 8px" backgroundColor="#28a745" borderRadius="12px">
                            <Text size="small" color="white">Nein</Text>
                          </Box>
                        </Box>
                        <Box width="60px">
                          <Box padding="4px 8px" backgroundColor="#28a745" borderRadius="12px">
                            <Text size="small" color="white">Neu</Text>
                          </Box>
                        </Box>
                        <Box width="60px">
                          <Box padding="4px 8px" backgroundColor="#007bff" borderRadius="12px">
                            <Text size="small" color="white">K</Text>
                          </Box>
                        </Box>
                        <Box flexGrow={1}>
                          <Box padding="8px" backgroundColor="#C8DEFD" borderRadius="4px">
                            <Text size="small">{patient.age}</Text>
                          </Box>
                        </Box>
                        <Box direction="horizontal" gap="SP2" width="200px">
                          <Button size="small" priority="secondary">Vorschau</Button>
                          <Button size="small" priority="secondary">Drucken</Button>
                          <Button size="small" priority="secondary" prefixIcon={<Icons.More />} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>

              {/* Filter Panel - Right Side */}
              <Box className={styles.filterPanel}>
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
                  boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                >
                  <Box direction="horizontal" gap="SP3" align="center" marginBottom="SP4">
                    <Text size="medium" weight="bold">Filterverfügbarkeit</Text>
                    <Button size="small" priority="secondary">
                      Alle Filter löschen
                    </Button>
                  </Box>

                  <Box direction="vertical" gap="SP4">
                    {/* Day Filter */}
                    <Box direction="vertical" gap="SP2">
                      <Text size="small" weight="bold">Tag</Text>
                      <Box padding="12px" border="1px solid #d0d0d0" borderRadius="6px">
                        <Text color="gray">Wähle einen Tag</Text>
                      </Box>
                    </Box>

                    {/* Time Slots */}
                    <Box direction="vertical" gap="SP2">
                      <Text size="small" weight="bold">Zeitfenster</Text>
                      <Box direction="vertical" gap="SP1">
                        {['8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19'].map((time) => (
                          <Box key={time} direction="horizontal" gap="SP2" align="center">
                            <Box width="16px" height="16px" border="2px solid #007bff" borderRadius="4px" />
                            <Text size="small">{time}</Text>
                          </Box>
                        ))}
                      </Box>
                    </Box>

                    {/* Home Visit */}
                    <Box direction="vertical" gap="SP2">
                      <Text size="small" weight="bold">Hausbesuch</Text>
                      <Box direction="vertical" gap="SP1">
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box width="16px" height="16px" border="2px solid #007bff" borderRadius="4px" />
                          <Text size="small">Ja</Text>
                        </Box>
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box width="16px" height="16px" border="2px solid #007bff" borderRadius="4px" />
                          <Text size="small">Nein</Text>
                        </Box>
                      </Box>
                    </Box>

                    {/* Age Groups */}
                    <Box direction="vertical" gap="SP2">
                      <Text size="small" weight="bold">Altersgruppe</Text>
                      <Box direction="vertical" gap="SP1">
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box width="16px" height="16px" border="2px solid #007bff" borderRadius="4px" />
                          <Text size="small">Kinder (0-12)</Text>
                        </Box>
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box width="16px" height="16px" border="2px solid #007bff" borderRadius="4px" />
                          <Text size="small">Jugendliche (13-17)</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>

            </Box>
          </Box>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default PatientDashboard;