import React from 'react';
import PropTypes from 'prop-types';
import { Select, Paper, Text } from '@mantine/core';
import LineChart from './LineChart';
import BarChart from './BarChart';

const DataChart = ({ data, type = 'line', title, onTypeChange }) => {
  const chartTypes = [
    { value: 'line', label: 'Gráfico de Líneas' },
    { value: 'bar', label: 'Gráfico de Barras' },
  ];

DataChart.propTypes = {
    data: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['line', 'bar']),
    title: PropTypes.string.isRequired,
    onTypeChange: PropTypes.func.isRequired
};


  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <BarChart data={data} title={title} />;
      case 'line':
      default:
        return <LineChart data={data} title={title} />;
    }
  };

  return (
    <Paper shadow="xs" p="md" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Text size="lg" weight={500}>{title}</Text>
        <Select
          value={type}
          onChange={onTypeChange}
          data={chartTypes}
          style={{ width: '200px' }}
        />
      </div>
      {renderChart()}
    </Paper>
  );
};

export default DataChart;