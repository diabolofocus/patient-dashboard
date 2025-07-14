// Fixed: src/dashboard/pages/patienten/page.tsx
// Using simple custom toolbar instead of complex TableToolbar

import React, { useState, useEffect, useMemo } from 'react';
import {
  Page,
  WixDesignSystemProvider,
  Button,
  Box,
  Text,
  Heading,
  Table,
  TableToolbar,
  TableActionCell,
  Search,
  Badge,
  Avatar,
  Card,
  Pagination
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { dashboard } from '@wix/dashboard';

const PatientDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(null);

  const ITEMS_PER_PAGE = 20;

  // Sample patient data - expanded for pagination demo
  const allPatients = [
    { id: '1', name: "Kurdic Mayson Ryan", date: "13.07.2025", age: "6 Jahre, 9 Mo", hb: "Nein", wv: "Neu", ke: "K" },
    { id: '2', name: "Bertsch Johannes Emil", date: "11.07.2025", age: "2 Jahre, 12 Mo", hb: "Nein", wv: "Neu", ke: "K" },
    { id: '3', name: "Schwarz Finja", date: "10.07.2025", age: "8 Jahre, 1 Mo", hb: "Nein", wv: "Neu", ke: "K" },
    { id: '4', name: "Dikow Valentin", date: "07.07.2025", age: "4 Jahre, 1 Mo", hb: "Nein", wv: "Neu", ke: "K" },
    { id: '5', name: "Dikow Emily", date: "07.07.2025", age: "4 Jahre, 1 Mo", hb: "Nein", wv: "Neu", ke: "K" },
    { id: '6', name: "Sachse", date: "05.07.2025", age: "10 Jahre, 3 Mo", hb: "Nein", wv: "Neu", ke: "K" },
    // Add more dummy data for pagination
    { id: '7', name: "Mueller Anna", date: "04.07.2025", age: "7 Jahre, 6 Mo", hb: "Ja", wv: "Alt", ke: "K" },
    { id: '8', name: "Schmidt Max", date: "03.07.2025", age: "15 Jahre, 2 Mo", hb: "Nein", wv: "Neu", ke: "E" },
    { id: '9', name: "Weber Lisa", date: "02.07.2025", age: "9 Jahre, 8 Mo", hb: "Nein", wv: "Alt", ke: "K" },
    { id: '10', name: "Fischer Tom", date: "01.07.2025", age: "12 Jahre, 1 Mo", hb: "Ja", wv: "Neu", ke: "K" },
  ];

  // Apply sorting
  const sortedPatients = useMemo(() => {
    if (!sortBy) return allPatients;

    return [...allPatients].sort((a, b) => {
      if (sortBy.field === 'date') {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return sortBy.direction === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      return 0;
    });
  }, [allPatients, sortBy]);

  // Apply pagination
  const totalPages = Math.ceil(sortedPatients.length / ITEMS_PER_PAGE);
  const currentPatients = sortedPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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

  const handleViewPatient = (patient: any) => {
    dashboard.showToast({
      message: `Öffne Details für ${patient.name}`,
      type: 'standard',
    });
  };

  const handlePrintPatient = (patient: any) => {
    dashboard.showToast({
      message: `Drucke ${patient.name}`,
      type: 'standard',
    });
  };

  const handleSort = (field: string) => {
    setSortBy(prev => {
      if (prev?.field === field) {
        return { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { field, direction: 'desc' };
    });
  };

  const handleSelectionChange = (selectedIds: string[] | number[] | null | undefined) => {
    const stringIds = selectedIds ? selectedIds.map(id => String(id)) : [];
    setSelectedRows(stringIds);
  };

  const handlePageChange = (event: { page: number }) => {
    setCurrentPage(event.page);
  };

  // Table columns definition with proper typing
  const columns = [
    {
      title: 'Name',
      render: (row: any) => (
        <Box direction="horizontal" gap="SP2" align="center">
          <Avatar size="size30" />
          <Text>{row.name}</Text>
        </Box>
      ),
      width: '25%'
    },
    {
      title: 'Datum (Neueste)',
      render: (row: any) => <Text>{row.date}</Text>,
      width: '15%',
      sortable: true,
      sortDescending: sortBy?.field === 'date' ? sortBy.direction === 'desc' : undefined,
      onSortClick: () => handleSort('date')
    },
    {
      title: 'HB',
      render: (row: any) => (
        <Badge skin="success" size="small">
          {row.hb}
        </Badge>
      ),
      width: '8%'
    },
    {
      title: 'WV',
      render: (row: any) => (
        <Badge skin="success" size="small">
          {row.wv}
        </Badge>
      ),
      width: '8%'
    },
    {
      title: 'K/E',
      render: (row: any) => (
        <Badge skin="standard" size="small">
          {row.ke}
        </Badge>
      ),
      width: '8%'
    },
    {
      title: 'Alter',
      render: (row: any) => (
        <Text size="small">{row.age}</Text>
      ),
      width: '15%'
    },
    {
      title: '',
      render: (row: any) => (
        <TableActionCell
          primaryAction={{
            text: 'Vorschau',
            icon: <Icons.Visible />,
            skin: 'standard',
            onClick: () => handleViewPatient(row)
          }}
          secondaryActions={[
            {
              text: 'Drucken',
              icon: <Icons.Print />,
              onClick: () => handlePrintPatient(row)
            },
            {
              text: 'Bearbeiten',
              icon: <Icons.Edit />,
              onClick: () => console.log('Edit', row.name)
            },
            {
              text: 'Löschen',
              icon: <Icons.Delete />,
              onClick: () => console.log('Delete', row.name)
            }
          ]}
          numOfVisibleSecondaryActions={1}
        />
      ),
      width: '21%'
    }
  ];

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
          {/* Main Container - Vertical Stack */}
          <Box direction="vertical" gap="SP6" padding="24px">

            {/* Statistics Cards Section - Horizontal Row at Top */}
            <Box direction="horizontal" gap="SP4" width="100%">
              {/* Patient Total Card */}
              <Box
                backgroundColor="white"
                padding="24px"
                borderRadius="8px"
                flexGrow={1}
                width="200px"
              >
                <Text size="small" secondary>Patienten Insgesamt</Text>
                <Box marginTop="SP2">
                  <Heading size="large">77 Patienten</Heading>
                </Box>
              </Box>

              {/* Waiting Time Card */}
              <Box
                backgroundColor="white"
                padding="24px"
                borderRadius="8px"
                flexGrow={1}
                width="200px"
              >
                <Text size="small" secondary>Wartelistendauer</Text>
                <Box marginTop="SP2">
                  <Heading size="large">7 Monate</Heading>
                  <Text size="medium">23 Tage</Text>
                </Box>
              </Box>

              {/* Age Distribution Card */}
              <Box
                backgroundColor="white"
                padding="24px"
                borderRadius="8px"
                flexGrow={1}
                width="200px"
              >
                <Text size="small" secondary>Altersverteilung</Text>
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
                flexGrow={1}
                width="200px"
              >
                <Text size="small" secondary>Geschlechterverteilung</Text>
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
                flexGrow={1}
                width="200px"
                textAlign="center"
              >
                <Text size="small" secondary>{currentDate}</Text>
                <Box marginTop="SP2">
                  <Heading size="large">{currentTime}</Heading>
                </Box>
              </Box>
            </Box>

            {/* Main Content Area - Two Column Layout */}
            <Box direction="horizontal" gap="SP6" width="100%">

              {/* Left Column - Patient Table */}
              <Box direction="vertical" gap="SP4" flexGrow={1}>

                {/* Patient Table Section with Sticky Toolbar */}
                <Box
                  backgroundColor="white"
                  borderRadius="8px"
                >
                  {/* Wix Table with integrated toolbar */}
                  <Table
                    data={currentPatients}
                    columns={columns}
                    showSelection={true}
                    selectedIds={selectedRows}
                    onSelectionChanged={handleSelectionChange}
                    totalSelectableCount={sortedPatients.length}
                    withWrapper={false}
                  >
                    <Card>
                      <TableToolbar>
                        <TableToolbar.ItemGroup position="start">
                          <TableToolbar.Item>
                            <TableToolbar.Title>77 Patienten</TableToolbar.Title>
                          </TableToolbar.Item>
                          {selectedRows.length > 0 && (
                            <TableToolbar.Item>
                              <TableToolbar.Label>
                                {selectedRows.length} von {sortedPatients.length} ausgewählt
                              </TableToolbar.Label>
                            </TableToolbar.Item>
                          )}
                        </TableToolbar.ItemGroup>
                        <TableToolbar.ItemGroup position="start">
                          <TableToolbar.Item>
                            <TableToolbar.Label>
                              {sortedPatients.length} Patienten
                            </TableToolbar.Label>
                          </TableToolbar.Item>
                          <TableToolbar.Item>
                            <Search
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              placeholder="Suchen.."
                              size="small"
                            />
                          </TableToolbar.Item>
                          <TableToolbar.Item>
                            <Button
                              onClick={handleRefresh}
                              prefixIcon={<Icons.Refresh />}
                              priority="secondary"
                              size="small"
                            >
                              Aktualisieren
                            </Button>
                          </TableToolbar.Item>
                        </TableToolbar.ItemGroup>
                      </TableToolbar>
                      <Table.Content />
                    </Card>
                  </Table>
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box padding="16px 24px" borderTop="1px solid #e0e0e0">
                      <Box direction="horizontal" gap="SP4" align="center">
                        <Box flexGrow={1}>
                          <Text size="small">
                            Zeige {((currentPage - 1) * ITEMS_PER_PAGE) + 1} bis {Math.min(currentPage * ITEMS_PER_PAGE, sortedPatients.length)} von {sortedPatients.length} Patienten
                          </Text>
                        </Box>
                        <Box>
                          <Pagination
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onChange={handlePageChange}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>

              {/* Right Column - Filter Panel */}
              <Box width="300px">
                <Box
                  backgroundColor="white"
                  padding="24px"
                  borderRadius="8px"
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
                      <Box padding="12px" borderRadius="6px" style={{ border: '1px solid #d0d0d0' }}>
                        <Text secondary>Wähle einen Tag</Text>
                      </Box>
                    </Box>

                    {/* Time Slots */}
                    <Box direction="vertical" gap="SP2">
                      <Text size="small" weight="bold">Zeitfenster</Text>
                      <Box direction="vertical" gap="SP1">
                        {['8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19'].map((time) => (
                          <Box key={time} direction="horizontal" gap="SP2" align="center">
                            <Box style={{ width: '16px', height: '16px', border: '2px solid #007bff', borderRadius: '4px' }} />
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
                          <Box style={{ width: '16px', height: '16px', border: '2px solid #007bff', borderRadius: '4px' }} />
                          <Text size="small">Ja</Text>
                        </Box>
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box style={{ width: '16px', height: '16px', border: '2px solid #007bff', borderRadius: '4px' }} />
                          <Text size="small">Nein</Text>
                        </Box>
                      </Box>
                    </Box>

                    {/* Age Groups */}
                    <Box direction="vertical" gap="SP2">
                      <Text size="small" weight="bold">Altersgruppe</Text>
                      <Box direction="vertical" gap="SP1">
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box style={{ width: '16px', height: '16px', border: '2px solid #007bff', borderRadius: '4px' }} />
                          <Text size="small">Kinder (0-12)</Text>
                        </Box>
                        <Box direction="horizontal" gap="SP2" align="center">
                          <Box style={{ width: '16px', height: '16px', border: '2px solid #007bff', borderRadius: '4px' }} />
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