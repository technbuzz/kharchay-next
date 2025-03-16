import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { action } from "@storybook/addon-actions";
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { DynamicPriceComponent } from './dynamic-price.component';

export default {
  title: 'DynamicPriceComponent',
  component: DynamicPriceComponent,
  decorators: [
    moduleMetadata({
      imports: [
        FormsModule,
        IonicModule.forRoot()
      ],
    })
  ],
} as Meta<DynamicPriceComponent>;

const Template: Story<DynamicPriceComponent> = (args: DynamicPriceComponent) => ({
  props: {
    ...args,
    calculate: action('VAT value')
  }
});


export const Primary = Template.bind({});
Primary.args = {
    price:  0,
}