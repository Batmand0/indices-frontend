import React from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data, options, title = 'Análisis por Periodo' }) => {
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Semestre'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Porcentaje (%)'
        },
        min: 0,
        max: 100
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Line 
        data={data} 
        options={options || defaultOptions}
      />
    </div>
  );
};

LineChart.propTypes = {
  data: PropTypes.shape({
    labels: PropTypes.arrayOf(PropTypes.string),
    datasets: PropTypes.arrayOf(PropTypes.object)
  }).isRequired,
  options: PropTypes.object,
  title: PropTypes.string
};

LineChart.defaultProps = {
  title: 'Análisis por Periodo',
  options: null
};

export default LineChart;
