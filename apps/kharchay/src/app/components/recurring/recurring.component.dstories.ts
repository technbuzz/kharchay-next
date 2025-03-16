import type { Meta, StoryObj } from '@storybook/angular';
import { RecurringComponent } from './recurring.component';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<RecurringComponent> = {
  component: RecurringComponent,
  title: 'RecurringComponent',
};
export default meta;
type Story = StoryObj<RecurringComponent>;

export const Primary: Story = {
  args: {
    loading: false,
  },
};

export const Heading: Story = {
  args: {
    loading: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/recurring works!/gi)).toBeTruthy();
  },
};
