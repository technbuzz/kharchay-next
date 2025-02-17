import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from '@ionic/angular';
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CreateComponent } from './create.component';
import { action } from "@storybook/addon-actions";

export default {
  title: 'CreateComponent',
  component: CreateComponent,
  decorators: [
    moduleMetadata({
      imports: [
        ReactiveFormsModule,
        IonicModule.forRoot(),
        RouterTestingModule,
      ],
    })
  ],
} as Meta<CreateComponent>;

const Template: Story<CreateComponent> = (args: CreateComponent) => ({
  props: {
    ...args,
    formSubmit: action('form submitted')
  }
});


export const Primary = Template.bind({});
Primary.args = {
}