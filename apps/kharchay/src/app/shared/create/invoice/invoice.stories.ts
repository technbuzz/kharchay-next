import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { InvoiceComponent } from './invoice';
import { action } from "@storybook/addon-actions";

export default {
  title: 'InvoiceComponent',
  component: InvoiceComponent,
  decorators: [
    moduleMetadata({
      imports: [
        IonicModule.forRoot(),
        CommonModule
      ],
    })
  ],
} as Meta<InvoiceComponent>;

const Template: Story<InvoiceComponent> = (args: InvoiceComponent) => ({
  props: {
    ...args,
   imageRendered: action('Rendered Image Path') 
  }
});


export const Primary = Template.bind({});
Primary.args = {
}