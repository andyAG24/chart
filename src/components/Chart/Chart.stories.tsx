import { Meta, StoryObj } from '@storybook/react';
import { Chart } from './Chart';
import React from 'react';
import { LinesMock } from './Chart.mock';

const meta: Meta<typeof Chart> = {
  title: 'Chart',
  component: Chart,
};

export default meta;
type Story = StoryObj<typeof Chart>;

export const Main: Story = {
  render: () => (
    <Chart viewHeight={250} viewWidth={500} dpiRatio={2} config={{ padding: 50, rowsCount: 5 }} lines={LinesMock} />
  ),
};
