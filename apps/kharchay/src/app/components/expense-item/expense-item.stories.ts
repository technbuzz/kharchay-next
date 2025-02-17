import { argsToTemplate, type Meta, applicationConfig, type StoryObj } from '@storybook/angular';
import { ExpenseItemComponent } from './expense-item';


const meta: Meta<ExpenseItemComponent> = {
  component: ExpenseItemComponent,
  title: 'Components/ExpenseItem',
  render: args => ({
    props: args,
    // props: {
    //   ...args
    // },
    template: `<expense-item class="sami" [expense]="args.item"></expense-item>`,
  })
};
export default meta;
type Story = StoryObj<ExpenseItemComponent>;

export const Primary: Story = {

  args: {
    // readonly: false,
    item: {
      "id": "",
      "price": 77,
      "note": "Basic note",

      "category": {
        "title": "food"
      },

      "date": "",
      "details": false,
      "imageName": "",
      "imageUrl": "",

      "subCategory": {
        "title": "breakfast"
      },

      "fixed": false
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
