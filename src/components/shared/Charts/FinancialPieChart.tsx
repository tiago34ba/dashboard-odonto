import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTranslation } from 'react-i18next';

const FinancialPieChart: React.FC = () => {
  const { t } = useTranslation();

  const data = [
    {
      name: t('Receitas'),
      value: 10800,
      color: '#198754'
    },
    {
      name: t('Despesas'),
      value: 2350,
      color: '#fd7e14'
    },
    {
      name: t('Custo'),
      value: 2350,
      color: '#e74c3c'
    },
    {
      name: t('Lucro'),
      value: 8450,
      color: '#28a745'
    }
  ];

  const COLORS = data.map(item => item.color);

  const renderCustomTooltip = (props: any) => {
    if (props.active && props.payload && props.payload.length) {
      const data = props.payload[0];
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{data.name}</p>
          <p style={{ margin: 0, color: data.payload.color }}>
            R$ {data.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (entry: any) => {
    const percent = ((entry.value / data.reduce((acc, item) => acc + item.value, 0)) * 100).toFixed(1);
    return `${percent}%`;
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={renderCustomTooltip} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: entry.color }}>
                {value}: R$ {entry.payload && entry.payload.value !== undefined
                  ? entry.payload.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                  : ''}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinancialPieChart;
