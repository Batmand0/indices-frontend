import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Select, Paper, Text } from '@mantine/core';
import LineChart from './LineChart';
import BarChart from './BarChart';

const DataChart = forwardRef(({ data, type = 'line', title, onTypeChange }, ref) => {
  return (
    <Paper ref={ref} shadow="xs" p="md" style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <Text size="lg" weight={500}>{title}</Text>
        <Select
          value={type}
          onChange={onTypeChange}
          data={[
            { value: 'line', label: 'Gráfico de Líneas' },
            { value: 'bar', label: 'Gráfico de Barras' },
          ]}
          style={{ width: '200px' }}
        />
      </div>
      {type === 'bar' ? <BarChart data={data} title={title} /> : <LineChart data={data} title={title} />}
    </Paper>
  );
});

DataChart.displayName = 'DataChart';

DataChart.propTypes = {
  data: PropTypes.object.isRequired,
  type: PropTypes.oneOf(['line', 'bar']),
  title: PropTypes.string.isRequired,
  onTypeChange: PropTypes.func.isRequired
};

export default DataChart;