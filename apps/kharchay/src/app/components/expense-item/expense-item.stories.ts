import type { Meta, StoryObj } from '@storybook/angular';
import { ExpenseItemComponent } from './expense-item';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<ExpenseItemComponent> = {
  component: ExpenseItemComponent,
  title: 'ExpenseItemComponent',
};
export default meta;
type Story = StoryObj<ExpenseItemComponent>;

export const Primary: Story = {
  args: {
    readonly: false,
  },
};

export const Heading: Story = {
  args: {
    readonly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/expense-item works!/gi)).toBeTruthy();
  },
};
