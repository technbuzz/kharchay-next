import type { Meta, StoryObj } from '@storybook/angular';
import { PieComponent } from './pie';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<PieComponent> = {
  component: PieComponent,
  title: 'PieComponent',
};
export default meta;
type Story = StoryObj<PieComponent>;

export const Primary: Story = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/pie works!/gi)).toBeTruthy();
  },
};
