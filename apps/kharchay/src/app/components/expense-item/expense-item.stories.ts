import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ExpenseItemComponent } from './expense-item';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

const meta: Meta<ExpenseItemComponent> = {
  component: ExpenseItemComponent,
  title: 'ExpenseItemComponent',
  decorators: [
    moduleMetadata({
      imports: [
        IonicModule.forRoot(),
        CommonModule,
        ExpenseItemComponent
      ],
    })
  ],
};
export default meta;
type Story = StoryObj<ExpenseItemComponent>;

export const Primary: Story = {
  args: {
    readonly: false,
    item: {
      id: '',
      price: 30,
      note: 'Basic note',
      category: {
        title: 'food',
      },
      date: '',
      details: false,
      imageName: '',
      imageUrl: '',
      subCategory: {
        title: 'breakfast',
      },
      fixed: false
    }
  },
};

// export const Heading: Story = {
//   args: {
//     readonly: false,
//   },
//   play: async ({ canvasElement }) => {
//     const canvas = within(canvasElement);
//     expect(canvas.getByText(/expense-item works!/gi)).toBeTruthy();
//   },
// };
