import type { Meta, StoryObj } from '@storybook/angular';
import { DoughnutComponent } from './doughnut.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<DoughnutComponent> = {
  component: DoughnutComponent,
  title: 'DoughnutComponent',
};
export default meta;
type Story = StoryObj<DoughnutComponent>;

export const Primary: Story = {
  args: {
    chartData: '',
    chartLabel: '',
  },
};

export const Heading: Story = {
  args: {
    chartData: '',
    chartLabel: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/doughnut works!/gi)).toBeTruthy();
  },
};
