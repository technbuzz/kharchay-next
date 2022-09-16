import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RouterTestingModule } from "@angular/router/testing";
import { NewComponent } from './new.component';
import { action } from "@storybook/addon-actions";
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

export default {
  title: 'NewComponent',
  component: NewComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        RouterTestingModule
      ],
    })
  ],
} as Meta<NewComponent>;

const Template: Story<NewComponent> = (args: NewComponent) => ({
  props: {
    ...args,
  }
});


export const Primary = Template.bind({});
Primary.args = {
}

export const Prefilled = Template.bind({});
Prefilled.args = {
  price: ''
}